import { Component } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { Product } from '../../_models/product';

@Component({
  selector: 'flower-valley-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
})
export class CartComponent {
  public goods: Product[] = [];
  constructor(private cartService: CartService) {
    this.goods = cartService.getCart();
  }
}
