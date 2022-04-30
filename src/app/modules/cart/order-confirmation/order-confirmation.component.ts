import { ChangeDetectorRef, Component, Input, OnDestroy } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DestroyService } from '../../../_services/front/destroy.service';
import { forkJoin, map, Observable, of } from 'rxjs';
import { BusinessPackService } from '../../../_services/back/business-paсk.service';
import { ProductItem } from '../../../_models/product-item';
import { Message, MessageService } from 'primeng/api';
import { ActivatedRoute, Router } from '@angular/router';
import { isFormInvalid } from '../../../_utils/formValidCheck';
import { Invoice } from '../../../_models/business-pack/invoice';
import { GoodsInvoice } from '../../../_models/business-pack/goods-invoice';
import { CartService } from '../../../_services/front/cart.service';
import { ProductService } from '../../../_services/back/product.service';
import { Order, OrderItem } from '../../../_models/order';
import { BoxGenerateService } from '../../../_services/front/box-generate.service';
import { OrderService } from '../../../_services/back/order.service';
import { MailService } from '../../../_services/back/mail.service';
import { DocumentGenerateService } from '../../../_services/front/document-generate.service';
import { Firm } from '../../../_models/business-pack/firm';
import { orderWarnMessage } from '../../../_utils/constants';
import { CartVariables } from '../../../_models/static-data/variables';

@Component({
  selector: 'flower-valley-order-confirmation',
  templateUrl: './order-confirmation.component.html',
  styleUrls: ['./order-confirmation.component.scss'],
  providers: [DestroyService, DocumentGenerateService],
})
export class OrderConfirmationComponent implements OnDestroy {
  @Input()
  public cartVariables: CartVariables | undefined;
  public goods: ProductItem[] = [];
  public clientType: 'individual' | 'entity' = 'individual';
  public pickUp: FormControl;
  public deliveryDate: FormControl;
  public comment: FormControl;
  public currentDate = new Date();
  public contacts: FormGroup;
  public entityData!: FormGroup;
  private entityId: string | undefined;
  public orderId: number | undefined;
  public order: Order | undefined;
  public clientDataVerified: boolean = false;
  public isInvoiceLoading: boolean = false;
  private isEntityDataChanged: boolean = false;
  public isOrderConfirmed: boolean = false;
  public message: Message[] = [];

  constructor(
    private fb: FormBuilder,
    private $destroy: DestroyService,
    private cdr: ChangeDetectorRef,
    private bpService: BusinessPackService,
    private cartService: CartService,
    private productService: ProductService,
    private orderService: OrderService,
    private boxService: BoxGenerateService,
    private mailService: MailService,
    private documentService: DocumentGenerateService,
    private messageService: MessageService,
    private router: Router,
    private route: ActivatedRoute,
  ) {
    this.pickUp = fb.control(false);
    this.deliveryDate = fb.control(null);
    this.comment = fb.control('');
    this.contacts = fb.group({
      name: ['', [Validators.required]],
      phone: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      address: [''],
      deliveryWishDateFrom: [''],
      deliveryWishDateTo: [''],
      comment: [''],
      orderSum: [null, Validators.required],
    });
    if (this.cartService.isTulipsInclude) {
      this.pickUp.setValue(true);
      this.pickUp.disable();
      this.contacts.controls['address'].disable();
    }
    this.pickUp.valueChanges.subscribe((value) => {
      if (value) {
        this.contacts.controls['address'].setValue('');
        this.contacts.controls['address'].disable();
      } else {
        this.contacts.controls['address'].enable();
      }
    });
    this.deliveryDate.valueChanges.subscribe((dates: Date[] | null) => {
      this.contacts.controls['deliveryWishDateFrom'].setValue(dates ? dates[0] : null);
      this.contacts.controls['deliveryWishDateTo'].setValue(dates ? dates[0] : null);
    });
    this.comment.valueChanges.subscribe((comment: string) => {
      this.contacts.controls['comment'].setValue(comment);
    });
    this.cartService.cartUpdate().subscribe((goods) => {
      this.goods = goods;
    });
  }

  public ngOnDestroy(): void {
    if (this.isOrderConfirmed) {
      this.cartService.clearCart();
      this.message = [];
    }
  }

  public get isConfirmOrderDisabled(): boolean {
    if (this.contacts.invalid) return true;
    if (this.contacts.getRawValue().address) return false;
    return !this.pickUp.value;
  }

  public confirmOrder(): void {
    if (isFormInvalid(this.contacts)) return;
    if (this.isConfirmOrderDisabled) return;
    const order = this.getOrderData();
    if (this.clientType === 'entity') {
      if (isFormInvalid(this.entityData)) return;
      this.isInvoiceLoading = true;
      this.messageService.add(orderWarnMessage);
      this.entityData.disable();
      this.createInvoice(order);
    } else {
      this.isInvoiceLoading = true;
      this.messageService.add(orderWarnMessage);
      this.orderService.addItem(order).subscribe(
        (id: number) => {
          this.orderId = id;
          this.sendIndividualMail(id);
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
        if (!order.boxes.length && this.pickUp.value) {
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
                  order.accountNumber = id;
                  this.orderService.addItem(order).subscribe((orderId) => {
                    this.sendBusinessMail(invoiceId, partnerId, orderId);
                  });
                }
              });
          });
        } else {
          this.orderService.addItem(order).subscribe((orderId) => {
            const { FullName } = this.entityData.getRawValue();
            this.sendBusinessNotification(orderId, FullName);
          });
        }
        // order.boxes.map((box) => {
        //   goods.push({
        //     model_id: this.bpService.boxId,
        //     volume_id: this.bpService.boxVolume,
        //     nds: 0,
        //     nds_mode: 0,
        //     count: box.count,
        //     price: box.price,
        //     qname: 'Транспортировочная коробка (в ассортименте)',
        //   });
        // });
        // if (order.deliveryPrice) {
        //   goods.push({
        //     model_id: this.bpService.deliveryId,
        //     volume_id: this.bpService.deliveryVolume,
        //     nds: 0,
        //     nds_mode: 0,
        //     count: 1,
        //     price: order.deliveryPrice,
        //     qname: 'Доставка',
        //   });
        // }
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
      comment: contacts.comment,
      deliveryWishDateFrom: contacts.deliveryWishDateFrom
        ? contacts.deliveryWishDateFrom.toISOString()
        : null,
      deliveryWishDateTo: contacts.deliveryWishDateTo
        ? contacts.deliveryWishDateTo.toISOString()
        : null,
      orderSum: contacts.orderSum,
      products: products,
      boxes: orderBoxes,
      deliveryPrice: 0,
    };
    return <Order>order;
  }

  public setOrderSum(sum: number): void {
    this.contacts.controls['orderSum'].setValue(sum);
  }

  private sendIndividualMail(orderId: number): void {
    this.orderService.getItemById<Order>(orderId).subscribe((order) => {
      this.order = order;
      const docSub = this.documentService.getEstimate(order).subscribe((file) => {
        docSub.unsubscribe();
        const formData = new FormData();
        formData.append('file', file);
        formData.append('orderId', orderId.toString());
        formData.append('email', order.clientEmail);
        this.mailService.sendIndividualMail(formData, order).subscribe(() => {
          this.messageService.clear();
          const message: Message = {
            severity: 'success',
            summary: 'Заказ оформлен',
            detail: `Данные заказа №${orderId} отправлены на почту ${order.clientEmail}`,
            life: 10000,
            key: 'orderMessage',
          };
          this.messageService.add(message);
          this.isInvoiceLoading = false;
          this.isOrderConfirmed = true;
        });
      });
    });
  }

  private sendBusinessMail(invoiceId: string, firmId: string, orderId: number): void {
    const requests = [
      this.bpService.getInvoiceById(invoiceId),
      this.bpService.getFirmById(firmId),
      this.orderService.getItemById<Order>(orderId),
    ];
    forkJoin(requests).subscribe(([invoice, firm, orderItem]) => {
      invoice = invoice as any;
      firm = firm as Firm;
      const order = orderItem as Order;
      const docSub = this.documentService.getOffer(order, firm).subscribe((file) => {
        docSub.unsubscribe();
        const formData = new FormData();
        formData.append('file', file);
        formData.append('billNumber', invoice.Name);
        formData.append('billDate', invoice.Date);
        // @ts-ignore
        formData.append('accountNumber', order.accountNumber);
        formData.append('email', order.clientEmail);
        formData.append('orderId', orderId.toString());
        this.mailService.sendBusinessMail(formData, order, firm.FullName).subscribe(() => {
          this.messageService.clear();
          this.messageService.add({
            severity: 'success',
            summary: `Заявка №${orderId} принята`,
            detail: `Инструкции с дальнейшими действиями отправлены на почту ${order.clientEmail}`,
            life: 10000,
          });
          this.isInvoiceLoading = false;
          this.isOrderConfirmed = true;
          this.router.navigate(['download-invoice'], {
            relativeTo: this.route,
            queryParams: {
              invoice: order.accountNumber,
              order: orderId,
            },
          });
        });
      });
    });
  }

  private sendBusinessNotification(orderId: number, firmName: string): void {
    this.orderService.getItemById<Order>(orderId).subscribe((order) => {
      this.mailService.sendBusinessNotificationMail(order, firmName).subscribe(() => {
        this.messageService.clear();
        this.messageService.add({
          severity: 'success',
          summary: `Заявка №${orderId} принята`,
          detail: `После подтверждения заказа менеджером, Вам на почту будет отправлена инструкция с дальнейшими действиями`,
          life: 10000,
          key: 'orderMessage',
        });
        this.isInvoiceLoading = false;
        this.isOrderConfirmed = true;
      });
    });
  }
}
