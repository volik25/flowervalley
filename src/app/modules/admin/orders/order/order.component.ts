import { Component, OnInit } from '@angular/core';
import { OrderService } from '../../../../_services/back/order.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Order, OrderBox, OrderItem, OrderProduct } from '../../../../_models/order';
import { BusinessPackService } from '../../../../_services/back/business-paсk.service';
import { Firm } from '../../../../_models/business-pack/firm';
import { LoadingService } from '../../../../_services/front/loading.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Product } from '../../../../_models/product';
import { OrderStatus } from '../../../../_utils/order-status.enum';
import { getOrderStatus } from '../../../../_utils/constants';
import { EstimateGenerateService } from '../../../../_services/front/estimate-generate.service';
import { PriceConverterPipe } from '../../../../_pipes/price-converter.pipe';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'flower-valley-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss'],
  providers: [EstimateGenerateService, PriceConverterPipe, DatePipe],
})
export class OrderComponent implements OnInit {
  public orderId: number = 0;
  public clientEntity: Firm | undefined;
  public order: Order | undefined;
  public products: Product[] = [];
  constructor(
    private orderService: OrderService,
    private bpService: BusinessPackService,
    private estimatePDF: EstimateGenerateService,
    private priceConvert: PriceConverterPipe,
    private dateConvert: DatePipe,
    private route: ActivatedRoute,
    private router: Router,
    private ms: MessageService,
    private cs: ConfirmationService,
    private ls: LoadingService,
  ) {
    route.params.subscribe((params) => {
      this.orderId = params['id'];
    });
  }

  ngOnInit(): void {
    const orderSub = this.orderService.getItemById<Order>(this.orderId).subscribe((order) => {
      this.order = order;
      if (this.order.clientId) {
        const bpSub = this.bpService.getFirmById(this.order.clientId).subscribe((firm) => {
          this.clientEntity = firm;
          this.ls.removeSubscription(bpSub);
        });
        this.ls.addSubscription(bpSub);
      }
      this.ls.removeSubscription(orderSub);
    });
    this.ls.addSubscription(orderSub);
  }

  public saveOrder(): void {
    const order = { ...this.order };
    // @ts-ignore
    order.products = this.order.products.map((product: OrderProduct) => {
      return <OrderItem>{
        id: product.product.id,
        count: product.count,
        price: product.price,
      };
    });
    // @ts-ignore
    order.boxes = this.order.boxes.map((box: OrderBox) => {
      return <OrderItem>{
        id: box.box.id,
        count: box.count,
        price: box.price,
      };
    });
    delete order.requestNumber;
    // @ts-ignore
    const sub = this.orderService.updateItem<Order>(order).subscribe(() => {
      this.ls.removeSubscription(sub);
      this.ms.add({
        severity: 'success',
        summary: 'Заказ обновлен',
        detail: 'Обновленный заказ выслан на почту ' + this.order?.clientEmail,
      });
    });
    this.ls.addSubscription(sub);
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

  public openTelepack(): void {
    window.open('https://375.ru/' + this.order?.accountNumber);
  }

  public getEstimate(): void {
    if (this.order) {
      this.estimatePDF.getCompanyPDF(
        ['Товар', 'Цена ₽', 'Количество', 'Стоимость ₽'],
        this.order.products.map((goods) => [
          goods.product.name,
          goods.price,
          goods.count,
          goods.price * goods.count,
        ]),
        this.priceConvert.transform(this.order.deliveryPrice, 'two', 'rub'),
        this.priceConvert.transform(this.getBoxesSum(), 'two', 'rub'),
        this.priceConvert.transform(this.getProductsSum(), 'two', 'rub'),
        this.priceConvert.transform(this.getOrderSum(), 'two', 'rub'),
        this.orderId,
        this.dateConvert.transform(this.order.orderDate, 'dd.MM.yyyy HH:mm'),
      );
    }
  }
}
