import { Component, OnInit } from '@angular/core';
import { CartService } from '../../_services/front/cart.service';
import { Router } from '@angular/router';
import { ProductItem } from '../../_models/product-item';

@Component({
  selector: 'flower-valley-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  public cart: ProductItem[] = [];

  constructor(private cartService: CartService, private router: Router) {}

  ngOnInit(): void {
    this.cart = this.cartService.getCart();
    this.cartService.cartUpdate.subscribe((cart) => {
      this.cart = cart;
    });
  }

  public get getSum(): number {
    let sum = 0;
    this.cart?.map((cart) => (sum += cart.price * cart.count));
    return sum;
  }

  public get getCount(): number {
    return this.cart?.length || 0;
  }

  public goToCart(): void {
    this.router.navigate(['cart']);
  }
}
