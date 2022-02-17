import { Component } from '@angular/core';
import { OrderService } from '../../../_services/back/order.service';
import { LazyLoadEvent } from 'primeng/api';
import { Order } from '../../../_models/order';

@Component({
  selector: 'flower-valley-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss'],
})
export class OrdersComponent {
  public orders: Order[] = [];
  constructor(private orderService: OrderService) {}

  public getOrders(event: LazyLoadEvent): void {
    // eslint-disable-next-line no-console
    console.log(event);
    this.orderService.getItems(0, 20).subscribe((data) => {
      this.orders = data;
    });
  }
}
