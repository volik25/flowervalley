import { ChangeDetectorRef, Component, ElementRef, ViewChild } from '@angular/core';
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

@Component({
  selector: 'flower-valley-order-confirmation',
  templateUrl: './order-confirmation.component.html',
  styleUrls: ['./order-confirmation.component.scss'],
  providers: [DestroyService, YaMapService],
})
export class OrderConfirmationComponent {
  @ViewChild('mapContent') public mapContent: ElementRef<HTMLElement> | undefined;
  @ViewChild('yamap') public map: ElementRef<HTMLElement> | undefined;
  public goods: ProductItem[] = [];
  public clientType: 'individual' | 'entity' = 'individual';
  public pickUp: FormControl;
  public contacts: FormGroup;
  public entityData!: FormGroup;
  private entityId: string | undefined;
  public shippingCost: number | undefined;
  public delivery_error: string = '';
  public showDelivery = false;
  public showMap = false;
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
        switch (this.shippingCost) {
          case 0:
            this.delivery_error = 'Адрес не найден';
            break;
          case 2500:
            break;
          default:
            this.shippingCost = 2500 + 50 * calculationResult;
        }
        this.cdr.detectChanges();
      });
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

  public showMapToggle(): void {
    this.showMap = true;
    const yaMap = this.map;
    if (yaMap) {
      yaMap.nativeElement.style.width = '600px';
      yaMap.nativeElement.style.height = '600px';
      yaMap.nativeElement.style.position = 'static';
      if (this.mapContent) {
        this.mapContent.nativeElement.append(yaMap.nativeElement);
        this.yaMap.yaMapRedraw();
      }
    }
    this.cdr.detectChanges();
  }

  public visibleChange(): void {
    this.cdr.detectChanges();
  }

  public confirmOrder(): void {
    if (isFormInvalid(this.contacts)) return;
    if (this.clientType === 'entity') {
      if (isFormInvalid(this.entityData)) return;
      this.isInvoiceLoading = true;
      this.entityData.disable();
      this.createInvoice();
    } else {
      this.isInvoiceLoading = true;
      this.messageService.add({
        severity: 'success',
        summary: 'Заказ оформлен',
        detail: `Данные заказа отправлены на почту ${this.contacts.value.email}, ожидайте звонка оператора`,
      });
      this.isInvoiceLoading = false;
    }
  }

  private createInvoice(): void {
    this.getPartnerId().subscribe((partnerId) => {
      if (partnerId) {
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
                this.isInvoiceLoading = false;
                this.router.navigate(['download-invoice'], { relativeTo: this.route });
              }
            });
        });
      }
    });
  }

  private getPartnerId(): Observable<string | undefined> {
    if (this.entityId) {
      if (this.isEntityDataChanged) {
        return this.bpService
          .updateFirm({ ...this.entityData.getRawValue(), Object: this.entityId })
          .pipe(map((firm) => firm.Object));
      } else return of(this.entityId);
    } else {
      return this.bpService
        .createFirm(this.entityData.getRawValue())
        .pipe(map((firm) => firm.Object));
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
}
