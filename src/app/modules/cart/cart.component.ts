import { Component } from '@angular/core';
import { CartService } from '../../_services/front/cart.service';
import { ProductItem } from '../../_models/product-item';
import { BreadcrumbService } from '../../shared/breadcrumb/breadcrumb.service';

@Component({
  selector: 'flower-valley-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
})
export class CartComponent {
  public goods: ProductItem[] = [];
  constructor(private cartService: CartService, private _bs: BreadcrumbService) {
    this.goods = cartService.getCart();
    _bs.setItem('Корзина');
  }
}
