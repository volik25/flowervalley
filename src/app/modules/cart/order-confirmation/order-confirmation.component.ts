import { ChangeDetectorRef, Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DestroyService } from '../../../_services/front/destroy.service';
import { debounceTime, map, Observable, of, takeUntil } from 'rxjs';
import { YaMapService } from '../../../_services/front/ya-map.service';
import { BusinessPackService } from '../../../_services/back/business-paсk.service';
import { ProductItem } from '../../../_models/product-item';
import { MessageService } from 'primeng/api';
import { ActivatedRoute, Router } from '@angular/router';
import { isFormInvalid } from '../../../_utils/formValidCheck';
import { Invoice } from '../../../_models/business-pack/invoice';
import { GoodsInvoice } from '../../../_models/business-pack/goods-invoice';
import { CartService } from '../../../_services/front/cart.service';
import { ProductService } from '../../../_services/back/product.service';
import { Order, OrderItem } from '../../../_models/order';
import { BoxGenerateService } from '../../../_services/front/box-generate.service';
import { OrderService } from '../../../_services/back/order.service';

@Component({
  selector: 'flower-valley-order-confirmation',
  templateUrl: './order-confirmation.component.html',
  styleUrls: ['./order-confirmation.component.scss'],
  providers: [DestroyService, YaMapService],
})
export class OrderConfirmationComponent {
  public goods: ProductItem[] = [];
  public clientType: 'individual' | 'entity' = 'individual';
  public pickUp: FormControl;
  public contacts: FormGroup;
  public entityData!: FormGroup;
  private entityId: string | undefined;
  public shippingCost: number | undefined;
  public delivery_error: string = '';
  public showDelivery = false;
  public telepakId: string | undefined;
  public isInvoiceLoading: boolean = false;
  private isEntityDataChanged: boolean = false;

  constructor(
    private fb: FormBuilder,
    private $destroy: DestroyService,
    private yaMap: YaMapService,
    private cdr: ChangeDetectorRef,
    private bpService: BusinessPackService,
    private cartService: CartService,
    private productService: ProductService,
    private orderService: OrderService,
    private boxService: BoxGenerateService,
    private messageService: MessageService,
    private router: Router,
    private route: ActivatedRoute,
  ) {
    this.pickUp = fb.control(false);
    this.contacts = fb.group({
      name: ['', [Validators.required]],
      phone: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      address: [''],
    });
    this.contacts.controls['address'].valueChanges
      .pipe(takeUntil($destroy), debounceTime(1000))
      .subscribe((address) => {
        this.shippingCost = 0;
        this.showDelivery = false;
        this.delivery_error = '';
        if (address) {
          yaMap.addressChanged.next(address);
        } else {
          cdr.detectChanges();
        }
      });
    yaMap
      .calculateShippingCost()
      .pipe(takeUntil(this.$destroy))
      .subscribe((calculationResult) => {
        this.shippingCost = calculationResult;
        if (this.shippingCost === 0) {
          this.delivery_error = 'Адрес не найден';
        }
        this.cdr.detectChanges();
      });
    if (this.cartService.isTulipsInclude) {
      this.pickUp.setValue(true);
      this.pickUp.disable();
      this.contacts.controls['address'].disable();
    }
    this.pickUp.valueChanges.subscribe((value) => {
      if (value) {
        this.shippingCost = undefined;
        this.showDelivery = false;
        this.contacts.controls['address'].setValue('');
        this.contacts.controls['address'].disable();
      } else {
        this.contacts.controls['address'].enable();
      }
    });
    this.cartService.cartUpdate().subscribe((goods) => {
      this.goods = goods;
    });
  }

  public deliveryButtonClick(): void {
    this.showDelivery = true;
    this.cdr.detectChanges();
  }

  public showMapToggle(): void {}

  public confirmOrder(): void {
    if (isFormInvalid(this.contacts)) return;
    const order = this.getOrderData();
    if (this.clientType === 'entity') {
      if (isFormInvalid(this.entityData)) return;
      this.isInvoiceLoading = true;
      this.entityData.disable();
      this.createInvoice(order);
    } else {
      this.isInvoiceLoading = true;
      this.orderService.addItem(order).subscribe(
        () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Заказ оформлен',
            detail: `Данные заказа отправлены на почту ${this.contacts.value.email}, ожидайте звонка оператора`,
          });
          this.isInvoiceLoading = false;
          this.cartService.clearCart();
        },
        ({ error }) => {
          this.isInvoiceLoading = false;
          this.messageService.add({
            severity: 'error',
            summary: 'Что-то пошло не так',
            detail: error.message,
          });
        },
      );
    }
  }

  private createInvoice(order: Order): void {
    this.getPartner().subscribe(({ partnerId, inn }) => {
      if (partnerId) {
        order.clientId = partnerId;
        order.clientInn = inn;
        const firmId = this.bpService.selfId;
        const goods: GoodsInvoice[] = [];
        this.goods.map((product) => {
          if (product.id && product.volume) {
            goods.push({
              model_id: product.id,
              volume_id: product.volume,
              nds: 0,
              nds_mode: 0,
              count: product.count,
              price: product.price,
              qname: product.name,
            });
          }
        });
        const invoice: Invoice = {
          firm_id: firmId,
          partner_id: partnerId,
          goods: goods,
          partner_flag: 'A',
        };
        this.bpService.createInvoice(invoice).subscribe((response) => {
          const invoiceId = response.Object;
          this.bpService
            .sendInvoiceToTelepak(invoiceId, {
              report_name: 'Счет с образцом п. п. + печать подпись',
              send_with_stamp: true,
            })
            .subscribe(({ id }) => {
              if (id) {
                this.bpService.telepakId = id;
                order.accountNumber = id;
                this.orderService.addItem(order).subscribe(() => {
                  this.isInvoiceLoading = false;
                  this.router.navigate(['download-invoice'], { relativeTo: this.route });
                });
              }
            });
        });
      }
    });
  }

  private getPartner(): Observable<{ partnerId: string; inn: string }> {
    if (this.entityId) {
      if (this.isEntityDataChanged) {
        return this.bpService
          .updateFirm({ ...this.entityData.getRawValue(), Object: this.entityId })
          .pipe(
            map((firm) => {
              return {
                partnerId: firm.Object,
                inn: this.entityData.getRawValue().INN,
              };
            }),
          );
      } else return of({ partnerId: this.entityId, inn: this.entityData.getRawValue().INN });
    } else {
      return this.bpService.createFirm(this.entityData.getRawValue()).pipe(
        map((firm) => {
          return {
            partnerId: firm.Object,
            inn: this.entityData.getRawValue().INN,
          };
        }),
      );
    }
  }

  public entityDataChanges(data: FormGroup | { id: string; isChanged: boolean }): void {
    if (OrderConfirmationComponent.instanceOfId(data)) {
      this.entityId = data.id;
      this.isEntityDataChanged = data.isChanged;
    } else {
      this.entityData = data;
      if (!this.isEntityDataChanged) this.entityId = undefined;
    }
  }

  private static instanceOfId(data: any): data is { id: string; isChanged: boolean } {
    return 'id' in data;
  }

  public setClientType(i: number): void {
    if (i === 0) {
      this.clientType = 'individual';
    }
    if (i === 1) {
      this.clientType = 'entity';
    }
  }

  private getOrderData(): Order {
    const contacts = this.contacts.getRawValue();
    const products: OrderItem[] = [];
    this.goods.map((product) => {
      products.push(<OrderItem>{
        id: product.id,
        price: product.price,
        count: product.count,
      });
    });
    let orderBoxes: OrderItem[] = [];
    this.boxService.getBoxes().subscribe((boxes) => {
      boxes.map((box) => {
        orderBoxes.push(<OrderItem>{
          id: box.id,
          price: box.price,
          count: box.count,
        });
      });
    });
    const order = {
      clientEmail: contacts.email,
      clientName: contacts.name,
      clientPhone: contacts.phone,
      clientAddress: contacts.address ? contacts.address : 'Самовывоз',
      products: products,
      boxes: orderBoxes,
      deliveryPrice: 0,
    };
    if (this.shippingCost) order.deliveryPrice = this.shippingCost;
    return <Order>order;
  }
}
