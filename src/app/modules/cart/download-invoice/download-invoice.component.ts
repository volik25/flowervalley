import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OrderService } from '../../../_services/back/order.service';
import { Order } from '../../../_models/order';
import { OfferGenerateService } from '../../../_services/front/offer-generate.service';

@Component({
  selector: 'flower-valley-download-invoice',
  templateUrl: './download-invoice.component.html',
  styleUrls: ['./download-invoice.component.scss'],
  providers: [OfferGenerateService],
})
export class DownloadInvoiceComponent {
  public window = window;
  public telepakId: string = '';
  private order: Order | undefined;
  constructor(
    private route: ActivatedRoute,
    private orderService: OrderService,
    private offerService: OfferGenerateService,
  ) {
    route.queryParams.subscribe((params) => {
      this.telepakId = params['invoice'];
      const orderNumber = params['order'];
      orderService.getItemById<Order>(orderNumber).subscribe((order) => {
        this.order = order;
      });
    });
  }

  public getOffer(): void {}
}
