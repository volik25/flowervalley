import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OrderService } from '../../../_services/back/order.service';
import { Order } from '../../../_models/order';
import { OfferGenerateService } from '../../../_services/front/offer-generate.service';
import { BusinessPackService } from '../../../_services/back/business-paсk.service';
import { ProductService } from '../../../_services/back/product.service';

@Component({
  selector: 'flower-valley-download-invoice',
  templateUrl: './download-invoice.component.html',
  styleUrls: ['./download-invoice.component.scss'],
  providers: [OfferGenerateService],
})
export class DownloadInvoiceComponent {
  public window = window;
  public telepakId: string = '';
  public order: Order | undefined;
  constructor(
    private route: ActivatedRoute,
    private orderService: OrderService,
    private offerService: OfferGenerateService,
    private productService: ProductService,
    private bpService: BusinessPackService,
  ) {
    route.queryParams.subscribe((params) => {
      this.telepakId = params['invoice'];
      const orderNumber = params['order'];
      orderService.getItemById<Order>(orderNumber).subscribe((order) => {
        this.order = order;
      });
    });
  }

  public getOffer(): void {
    this.bpService.getFirmById(this.order?.clientId || '').subscribe((firm) => {
      let client = '';
      client += firm.FullName;
      client += `, ${firm.Address}`;
      client += `, ИНН: ${firm.INN}`;
      client += `, КПП: ${firm.KPP}`;
      // @ts-ignore
      const orderNumber = this.order.id;
      // @ts-ignore
      const date = new Date(this.order.orderDate).toLocaleDateString() + 'г.';
      const categories: string[] = [];
      let sum: number = 0;
      // @ts-ignore
      const content: any[] = this.order.products.map((product) => {
        sum += product.count * product.price;
        return [
          product.product.name,
          'шт.',
          product.price,
          product.count,
          product.count * product.price,
        ];
      });
      this.offerService.getPDF(orderNumber, date, client, categories, content, sum);
    });
  }
}
