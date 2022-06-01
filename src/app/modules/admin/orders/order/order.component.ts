import { Component, OnInit } from '@angular/core';
import { OrderService } from '../../../../_services/back/order.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Order, OrderBox, OrderDiscount, OrderItem, OrderProduct } from '../../../../_models/order';
import { BusinessPackService } from '../../../../_services/back/business-paсk.service';
import { Firm, Individual } from '../../../../_models/business-pack/firm';
import { LoadingService } from '../../../../_services/front/loading.service';
import { ConfirmationService, ConfirmEventType, MessageService } from 'primeng/api';
import { Product } from '../../../../_models/product';
import { OrderStatus } from '../../../../_utils/order-status.enum';
import { getOrderStatus, statusOptions } from '../../../../_utils/constants';
import { EstimateGenerateService } from '../../../../_services/front/estimate-generate.service';
import { PriceConverterPipe } from '../../../../_pipes/price-converter.pipe';
import { DatePipe } from '@angular/common';
import { FormBuilder, FormControl } from '@angular/forms';
import { Inplace } from 'primeng/inplace';
import { DateConverterService } from '../../../../_services/front/date-converter.service';
import { MailService } from '../../../../_services/back/mail.service';
import { DocumentGenerateService } from '../../../../_services/front/document-generate.service';
import { GoodsInvoice } from '../../../../_models/business-pack/goods-invoice';
import { Invoice } from '../../../../_models/business-pack/invoice';
import { forkJoin, map, Observable } from 'rxjs';
import { DocumentBox } from '../../../../_models/box';

@Component({
  selector: 'flower-valley-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss'],
  providers: [
    EstimateGenerateService,
    PriceConverterPipe,
    DatePipe,
    DateConverterService,
    DocumentGenerateService,
  ],
})
export class OrderComponent implements OnInit {
  public orderId?: number;
  public confirmedDate: FormControl;
  public currentDate = new Date();
  public clientEntity: Firm | undefined;
  public order: Order | undefined;
  public products: Product[] = [];
  public sendingMail: boolean = false;
  public orderDiscount: OrderDiscount | undefined;
  public sendMail: boolean = false;
  public statusDropdown = statusOptions;
  private invoiceNumber: string | undefined;
  constructor(
    private orderService: OrderService,
    private bpService: BusinessPackService,
    private estimatePDF: EstimateGenerateService,
    private priceConvert: PriceConverterPipe,
    private dateConvert: DatePipe,
    private dateConverter: DateConverterService,
    private mailService: MailService,
    private documentService: DocumentGenerateService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private ms: MessageService,
    private cs: ConfirmationService,
    private ls: LoadingService,
  ) {
    route.params.subscribe((params) => {
      this.orderId = params['id'];
    });
    this.confirmedDate = fb.control(null);
  }

  ngOnInit(): void {
    if (this.orderId) {
      const orderSub = this.orderService.getItemById<Order>(this.orderId).subscribe((order) => {
        this.order = {
          ...order,
          confirmedDeliveryDate: order.confirmedDeliveryDate
            ? this.dateConverter.convert(order.confirmedDeliveryDate)
            : undefined,
          deliveryWishDateFrom: order.deliveryWishDateFrom
            ? this.dateConverter.convert(order.deliveryWishDateFrom)
            : undefined,
          deliveryWishDateTo: order.deliveryWishDateTo
            ? this.dateConverter.convert(order.deliveryWishDateTo)
            : undefined,
        };
        let orderDiscount: OrderDiscount = {
          value: 0,
          percent: 0,
        };
        let productsSum: number = 0;
        this.order.products.map((product) => {
          const discount = product.product.price - product.price;
          if (discount > 0) {
            orderDiscount.value += discount * product.count;
          }
          productsSum += product.price * product.count;
        });
        if (orderDiscount) {
          this.orderDiscount = orderDiscount;
          this.orderDiscount.percent = Math.round(
            (this.orderDiscount.value / (this.orderDiscount.value + productsSum)) * 100,
          );
        }
        if (this.order.deliveryWishDateFrom) {
          this.confirmedDate.setValue(
            // @ts-ignore
            new Date(this.dateConverter.convert(order.deliveryWishDateFrom)),
          );
        }
        if (this.order.clientId) {
          const bpSub = this.bpService.getFirmById(this.order.clientId).subscribe((firm) => {
            this.clientEntity = firm;
            this.ls.removeSubscription(bpSub);
          });
          this.ls.addSubscription(bpSub);
        }
        this.ls.removeSubscription(orderSub);
        if (this.order.invoiceId) {
          const bpSub = this.bpService.getInvoiceById(this.order.invoiceId).subscribe(
            (invoice) => {
              this.invoiceNumber = invoice.Name;
              this.ls.removeSubscription(bpSub);
            },
            () => {
              this.ms.add({
                severity: 'error',
                summary: 'Ошибка получения номера счёта',
                detail: 'Счёт не найден',
                life: 5000,
              });
              this.ls.removeSubscription(bpSub);
            },
          );
          this.ls.addSubscription(bpSub);
        }
        if (this.order.status === OrderStatus.New) this.order.status = OrderStatus.In_Process;
      });
      this.ls.addSubscription(orderSub);
    }
  }

  public saveOrder(): void {
    const order: any = { ...this.order };
    let sum = 0;
    // @ts-ignore
    order.products = this.order.products.map((product: OrderProduct) => {
      sum += product.count * product.price;
      return <OrderItem>{
        id: product.product.id,
        count: product.count,
        price: product.price,
      };
    });
    if (order && order.confirmedDeliveryDate) {
      order.confirmedDeliveryDate = (order.confirmedDeliveryDate as Date).toISOString();
    }
    // @ts-ignore
    order.boxes = this.order.boxes.map((box: OrderBox) => {
      sum += box.count * box.price;
      return <OrderItem>{
        id: box.box.id,
        count: box.count,
        price: box.price,
      };
    });
    if (!order.requestNumber) {
      delete order.requestNumber;
    }
    if (!order.accountNumber) {
      delete order.accountNumber;
    }
    if (!order.invoiceId) {
      delete order.invoiceId;
    }
    if (!order.clientId) {
      delete order.clientId;
    }
    if (!order.clientInn) {
      delete order.clientInn;
    }
    if (order.deliveryPrice) {
      if (this.order && this.order.status === OrderStatus.Calculate_Delivery) {
        this.order.status = OrderStatus.In_Process;
        order.status = this.order.status;
      }
      sum += order.deliveryPrice;
    }
    order.orderSum = sum;
    // @ts-ignore
    const saveOrderSub = this.orderService.updateItem<Order>(order).subscribe(() => {
      if (this.sendMail) {
        if (order.clientInn) {
          // @ts-ignore
          this.sendInvoiceMail(this.order.invoiceId, this.order.clientId, this.order.id, true);
        } else {
          // @ts-ignore
          this.sendInvoiceMail(this.order.invoiceId, this.order.clientId, this.order.id, false);
        }
      } else {
        this.sendingMail = false;
        this.ms.add({
          severity: 'success',
          summary: 'Заказ изменен',
          detail: `Данные сохранены в системе`,
        });
      }
      this.ls.removeSubscription(saveOrderSub);
    });
    this.ls.addSubscription(saveOrderSub);
  }

  public getStatus(status: OrderStatus): { label: string; severity: string } {
    return getOrderStatus(status);
  }

  public repeatOrder(): void {
    this.router.navigate(['admin/orders/create'], {
      queryParams: {
        orderId: this.order?.id,
      },
    });
  }

  public getOrderSum(): number {
    let sum = 0;
    if (this.order) {
      sum += this.order.deliveryPrice;
      sum += this.getProductsSum();
      sum += this.getBoxesSum();
    }
    return sum;
  }

  public getProductsSum(): number {
    let sum = 0;
    if (this.order)
      this.order.products.map((product) => {
        sum += product.price * product.count;
      });
    return sum;
  }

  public getBoxesSum(): number {
    let sum = 0;
    if (this.order) {
      this.order.boxes.map((box) => {
        sum += box.price * box.count;
      });
    }
    return sum;
  }

  public getDocumentBoxes(): DocumentBox[] {
    const boxes: DocumentBox[] = [];
    if (this.order) {
      this.order.boxes.map((box) => {
        boxes.push({
          name: box.box.name,
          price: box.price,
          count: box.count,
        });
      });
    }
    return boxes;
  }

  public openTelepack(): void {
    window.open('https://375.ru/' + this.order?.accountNumber);
  }

  public getEstimate(): void {
    if (this.order) {
      this.estimatePDF.getCompanyPDF(
        this.order.products
          .sort(
            (a, b) =>
              // @ts-ignore
              (a.product.category?.id ||
                // @ts-ignore
                a.product.categoryId) -
              // @ts-ignore
              (b.product.category?.id ||
                // @ts-ignore
                b.product.categoryId),
          )
          .map((goods) => [
            goods.product.name,
            goods.price,
            goods.count,
            goods.price * goods.count,
          ]),
        this.priceConvert.transform(this.order.deliveryPrice || 0, 'two', 'none'),
        this.getDocumentBoxes(),
        this.priceConvert.transform(this.getProductsSum(), 'two', 'rub'),
        this.priceConvert.transform(this.getOrderSum(), 'two', 'none'),
        this.order,
        this.dateConvert.transform(this.order.confirmedDeliveryDate, 'dd.MM.yyyy'),
        this.invoiceNumber,
      );
    }
  }

  public confirmDate(inplace: Inplace): void {
    inplace.deactivate();
    // @ts-ignore
    this.order.confirmedDeliveryDate = this.confirmedDate.value;
  }

  public confirmSaving(): void {
    this.sendMail = false;
    this.cs.confirm({
      header: 'Сохранение заказа',
      message: 'Выберите способ сохранения',
      acceptLabel: 'Сохранить и отправить письмо клиенту',
      acceptIcon: 'pi pi-times',
      rejectLabel: 'Сохранить без отправки письма',
      accept: () => {
        this.sendMail = true;
        if (this.order && this.order.invoiceId) {
          const deleteInvoiceSub = this.bpService
            .deleteInvoice(this.order.invoiceId)
            .subscribe(() => {
              this.ls.removeSubscription(deleteInvoiceSub);
              this.createInvoice();
            });
          this.ls.addSubscription(deleteInvoiceSub);
        } else {
          this.createInvoice();
        }
      },
      reject: (type: ConfirmEventType) => {
        switch (type) {
          case ConfirmEventType.REJECT:
            this.sendMail = false;
            this.saveOrder();
            break;
          case ConfirmEventType.CANCEL:
            this.ms.add({
              severity: 'warn',
              summary: 'Сохранение отменено',
              detail: 'Вы отменили сохранение заказа',
            });
            break;
        }
      },
    });
  }

  private createInvoice(): void {
    const goods: GoodsInvoice[] = [];
    this.orderService.generateOrderProducts(this.order?.products || []).map((product) => {
      goods.push({
        volume_id: product.volume,
        model_name: product.name,
        qname: product.name,
        nds: 0,
        nds_mode: 0,
        count: product.count,
        price: product.price,
      });
    });
    // @ts-ignore
    this.order.boxes.map((box) => {
      goods.push({
        model_id: this.bpService.boxId,
        volume_id: this.bpService.boxVolume,
        nds: 0,
        nds_mode: 0,
        count: box.count,
        price: box.price,
        qname: 'Транспортировочная коробка (в ассортименте)',
      });
    });
    // @ts-ignore
    if (this.order.deliveryPrice) {
      goods.push({
        model_id: this.bpService.deliveryId,
        volume_id: this.bpService.deliveryVolume,
        nds: 0,
        nds_mode: 0,
        count: 1,
        // @ts-ignore
        price: this.order.deliveryPrice,
        qname: 'Доставка',
      });
    }
    if (this.order && !this.order.clientId) {
      const createEntitySub = this.createIndividualEntity().subscribe((partnerId) => {
        this.ls.removeSubscription(createEntitySub);
        this.bpRequest(goods, partnerId);
      });
      this.ls.addSubscription(createEntitySub);
    } else {
      this.bpRequest(goods, this.order?.clientId as string);
    }
  }

  private bpRequest(goods: GoodsInvoice[], partnerId: string): void {
    const firmId = this.bpService.selfId;
    const invoice: Invoice = {
      firm_id: firmId,
      partner_id: partnerId,
      goods: goods,
      partner_flag: 'A',
    };
    const createInvoiceSub = this.bpService.createInvoice(invoice).subscribe((response) => {
      const invoiceId = response.Object;
      // @ts-ignore
      this.order.invoiceId = invoiceId;
      const telepakSub = this.bpService
        .sendInvoiceToTelepak(invoiceId, {
          report_name: 'Счет с образцом п. п. + печать подпись',
          send_with_stamp: true,
        })
        .subscribe(({ id }) => {
          this.ls.removeSubscription(telepakSub);
          if (id) {
            // @ts-ignore
            this.order.accountNumber = id;
            this.saveOrder();
          }
        });
      this.ls.addSubscription(telepakSub);
      this.ls.removeSubscription(createInvoiceSub);
    });
    this.ls.addSubscription(createInvoiceSub);
  }

  public createIndividualEntity(): Observable<string> {
    return this.bpService
      .createFirm({
        FullName: this.order?.clientName,
        Address: `${this.order && this.order.clientAddress ? this.order.clientAddress + ',' : ''} ${
          this.order?.clientPhone
        }, ${this.order?.clientEmail}`,
      } as Individual)
      .pipe(
        map((firm) => {
          // @ts-ignore
          this.order.clientId = firm.Object;
          return firm.Object;
        }),
      );
  }

  private sendInvoiceMail(
    invoiceId: string,
    firmId: string,
    orderId: number,
    isBusiness: boolean,
  ): void {
    const requests = [
      this.bpService.getInvoiceById(invoiceId),
      this.bpService.getFirmById(firmId),
      this.orderService.getItemById<Order>(orderId),
    ];
    const sub = forkJoin(requests).subscribe(([invoice, firm, orderItem]) => {
      invoice = invoice as any;
      firm = firm as Firm;
      const order = orderItem as Order;
      const formData = new FormData();
      formData.append('billNumber', invoice.Name);
      formData.append('billDate', invoice.Date);
      // @ts-ignore
      formData.append('accountNumber', order.accountNumber);
      formData.append('email', order.clientEmail);
      formData.append('orderId', orderId.toString());
      if (isBusiness) {
        const docSub = this.documentService.getOffer(order, firm).subscribe((file) => {
          docSub.unsubscribe();
          formData.append('file', file);
          const mailSub = this.mailService
            .sendBusinessMail(formData, order, firm.FullName)
            .subscribe(() => {
              this.ls.removeSubscription(mailSub);
              this.ms.add({
                severity: 'success',
                summary: 'Заказ изменен',
                detail: `Обновленные данные заказа отправлены на почту ${order.clientEmail}`,
              });
            });
          this.ls.addSubscription(mailSub);
        });
      } else {
        const mailSub = this.mailService.sendIndividualMail(formData, order).subscribe(() => {
          this.ls.removeSubscription(mailSub);
          this.ms.add({
            severity: 'success',
            summary: 'Заказ изменен',
            detail: `Обновленные данные заказа отправлены на почту ${order.clientEmail}`,
          });
        });
        this.ls.addSubscription(mailSub);
      }
      this.ls.removeSubscription(sub);
    });
    this.ls.addSubscription(sub);
  }
}
