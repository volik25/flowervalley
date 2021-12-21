import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Product } from '../_models/product';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  public readonly cartUpdate: Subject<Product[]> = new Subject();

  public getCart(): Product[] {
    const cart = sessionStorage.getItem('cart');
    if (cart) return JSON.parse(cart);
    return [];
  }

  public addToCart(item: Product): void {
    const cart = sessionStorage.getItem('cart');
    if (cart) {
      let cartUpdated: Product[] = JSON.parse(cart);
      const product = cartUpdated.find((cartItem) => item.id === cartItem.id);
      if (product) {
        product.count += item.count;
      } else {
        cartUpdated.push(item);
      }
      sessionStorage.setItem('cart', JSON.stringify(cartUpdated));
      this.cartUpdate.next(cartUpdated);
    } else {
      sessionStorage.setItem('cart', JSON.stringify([item]));
      this.cartUpdate.next([item]);
    }
  }

  public removeFromCart(id: number): void {
    const cart = sessionStorage.getItem('cart');
    if (cart) {
      let cartUpdated: Product[] = JSON.parse(cart);
      const index = cartUpdated.findIndex((cartItem) => id === cartItem.id);
      cartUpdated.splice(index, 1);
      sessionStorage.setItem('cart', JSON.stringify(cartUpdated));
      this.cartUpdate.next(cartUpdated);
    }
  }

  public updateCount(item: Product): void {
    const cart = sessionStorage.getItem('cart');
    if (cart) {
      let cartUpdated: Product[] = JSON.parse(cart);
      const product = cartUpdated.find((cartItem) => item.id === cartItem.id);
      if (product) {
        product.count = item.count;
      }
      sessionStorage.setItem('cart', JSON.stringify(cartUpdated));
      this.cartUpdate.next(cartUpdated);
    }
  }
}
