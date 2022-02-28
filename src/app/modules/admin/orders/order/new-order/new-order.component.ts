import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OrderService } from '../../../../../_services/back/order.service';
import { Order, OrderBox, OrderItem, OrderProduct } from '../../../../../_models/order';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { isFormInvalid } from '../../../../../_utils/formValidCheck';
import { debounceTime, map, Observable, of, takeUntil } from 'rxjs';
import { YaMapService } from '../../../../../_services/front/ya-map.service';
import { DestroyService } from '../../../../../_services/front/destroy.service';
import { LoadingService } from '../../../../../_services/front/loading.service';
import { BusinessPackService } from '../../../../../_services/back/business-paсk.service';
import { Firm } from '../../../../../_models/business-pack/firm';
import { MessageService } from 'primeng/api';
import { GoodsInvoice } from '../../../../../_models/business-pack/goods-invoice';
import { Invoice } from '../../../../../_models/business-pack/invoice';
import { ProductService } from '../../../../../_services/back/product.service';

@Component({
  selector: 'flower-valley-new-order',
  templateUrl: './new-order.component.html',
  styleUrls: ['./new-order.component.scss'],
  providers: [DestroyService, YaMapService],
})
export class NewOrderComponent implements OnInit {
  private orderId: number | undefined;
  public order: Order | undefined;
  public products: OrderProduct[] = [];
  public boxes: OrderBox[] = [];
  public entity: Firm | undefined;
  public entityData!: FormGroup;
  private entityId: string | undefined;
  private isEntityDataChanged: boolean = false;
  public contactsGroup: FormGroup;
  public shippingCost: number | undefined;
  public delivery_error: string = '';
  public showDelivery = false;
  constructor(
    private orderService: OrderService,
    private productService: ProductService,
    private bpService: BusinessPackService,
    private fb: FormBuilder,
    private ls: LoadingService,
    private route: ActivatedRoute,
    private router: Router,
    private yaMap: YaMapService,
    private ms: MessageService,
    private $destroy: DestroyService,
    private cdr: ChangeDetectorRef,
  ) {
    this.contactsGroup = fb.group({
      requestNumber: [''],
      clientName: ['', Validators.required],
      clientPhone: ['', Validators.required],
      clientEmail: ['', Validators.required],
      clientAddress: ['', Validators.required],
    });
    route.queryParams.subscribe((params) => {
      this.orderId = params['orderId'];
    });
    this.contactsGroup.controls['clientAddress'].valueChanges
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
        if (this.shippingCost && !this.delivery_error) {
          this.deliveryButtonClick();
        }
        this.cdr.detectChanges();
      });
  }

  ngOnInit(): void {
    if (this.orderId) {
      const sub = this.orderService.getItemById<Order>(this.orderId).subscribe((order) => {
        this.products = order.products;
        this.boxes = order.boxes;
        this.order = order;
        this.contactsGroup.patchValue(order);
        if (order.clientId) {
          const bpSub = this.bpService.getFirmById(order.clientId).subscribe((firm) => {
            this.entity = firm;
            this.ls.removeSubscription(bpSub);
          });
          this.ls.addSubscription(bpSub);
        }
        this.ls.removeSubscription(sub);
      });
      this.ls.addSubscription(sub);
    }
  }

  public entityDataChanges(data: FormGroup | { id: string; isChanged: boolean }): void {
    if (NewOrderComponent.instanceOfId(data)) {
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

  public createOrder(): void {
    if (isFormInvalid(this.contactsGroup)) return;
    const order = this.getOrderData();
    if (order.requestNumber || this.order?.clientId) {
      if (isFormInvalid(this.entityData)) return;
      this.entityData.disable();
      this.createInvoice(order);
    } else {
      const products: OrderItem[] = [];
      order.products.map((product: any) => {
        products.push(<OrderItem>{
          id: product.product.id,
          count: product.count,
          price: product.price,
        });
      });
      const sub = this.orderService.addItem({ ...order, products: products }).subscribe(
        () => {
          this.ms.add({
            severity: 'success',
            summary: 'Заказ оформлен',
            detail: `Данные заказа отправлены на почту ${this.contactsGroup.value.clientEmail}`,
          });
          this.ls.removeSubscription(sub);
          this.router.navigate(['admin/orders']);
        },
        ({ error }) => {
          this.ms.add({
            severity: 'error',
            summary: 'Что-то пошло не так',
            detail: error.message,
          });
        },
      );
      this.ls.addSubscription(sub);
    }
  }

  private getOrderData(): Order {
    const contacts = this.contactsGroup.getRawValue();
    let orderBoxes: OrderItem[] = [];
    this.boxes.map((box) => {
      orderBoxes.push(<OrderItem>{
        id: box.box.id,
        price: box.price,
        count: box.count,
      });
    });
    const order = <Order>{
      clientEmail: contacts.clientEmail,
      clientName: contacts.clientName,
      clientPhone: contacts.clientPhone,
      clientAddress: contacts.clientAddress ? contacts.clientAddress : 'Самовывоз',
      products: this.products,
      boxes: orderBoxes,
      deliveryPrice: 0,
    };
    if (contacts.requestNumber) order.requestNumber = contacts.requestNumber;
    if (this.shippingCost) order.deliveryPrice = this.shippingCost;
    return <Order>order;
  }
  private createInvoice(order: Order): void {
    this.getPartner().subscribe(({ partnerId, inn }) => {
      if (partnerId) {
        order.clientId = partnerId;
        order.clientInn = inn;
        const firmId = this.bpService.selfId;
        const goods: GoodsInvoice[] = [];
        const productSub = this.productService.getItems().subscribe((products) => {
          products.map((product) => {
            const orderProduct = order.products.find((item) => item.id === product.id);
            if (product.id && product.volume && orderProduct) {
              goods.push({
                model_id: product.id,
                volume_id: product.volume,
                nds: 0,
                nds_mode: 0,
                count: orderProduct.count,
                price: orderProduct.price,
                qname: orderProduct.product.name,
              });
            }
          });
          this.ls.removeSubscription(productSub);
        });
        this.ls.addSubscription(productSub);
        const invoice: Invoice = {
          firm_id: firmId,
          partner_id: partnerId,
          goods: goods,
          partner_flag: 'A',
        };
        const invoiceSub = this.bpService.createInvoice(invoice).subscribe((response) => {
          const invoiceId = response.Object;
          const sendSub = this.bpService
            .sendInvoiceToTelepak(invoiceId, {
              report_name: 'Счет с образцом п. п. + печать подпись',
              send_with_stamp: true,
            })
            .subscribe(({ id }) => {
              if (id) {
                order.accountNumber = id;
                const products: OrderItem[] = [];
                order.products.map((product: any) => {
                  products.push(<OrderItem>{
                    id: product.product.id,
                    count: product.count,
                    price: product.price,
                  });
                });
                const orderSub = this.orderService
                  .addItem({ ...order, products: products })
                  .subscribe(() => {
                    this.ls.removeSubscription(orderSub);
                    this.ms.add({
                      severity: 'success',
                      summary: 'Заказ оформлен',
                      detail: `Данные заказа отправлены на почту ${this.contactsGroup.value.clientEmail}`,
                    });
                    this.router.navigate(['admin/orders']);
                  });
                this.ls.addSubscription(orderSub);
              }
              this.ls.removeSubscription(sendSub);
            });
          this.ls.addSubscription(sendSub);
          this.ls.removeSubscription(invoiceSub);
        });
        this.ls.addSubscription(invoiceSub);
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

  public deliveryButtonClick(): void {
    this.showDelivery = true;
    this.cdr.detectChanges();
  }
}
