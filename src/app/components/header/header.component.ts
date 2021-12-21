import { Component, OnInit } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { Router } from '@angular/router';
import { Product } from '../../_models/product';

@Component({
  selector: 'flower-valley-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  public cart: Product[] = [];

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
