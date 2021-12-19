import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  public readonly cartUpdate: Subject<Record<string, any>[] | null> = new Subject();

  public getCart(): Record<string, any>[] | null {
    const cart = sessionStorage.getItem('cart');
    if (cart) return JSON.parse(cart);
    return null;
  }

  public addToCart(item: Record<string, any>): void {
    const cart = sessionStorage.getItem('cart');
    if (cart) {
      let cartUpdated: Record<string, any>[] = JSON.parse(cart);
      const product = cartUpdated.find((cartItem) => item['id'] === cartItem['id']);
      if (product) {
        product['count'] += item['count'];
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
      let cartUpdated: Record<string, any>[] = JSON.parse(cart);
      const index = cartUpdated.findIndex((cartItem) => id === cartItem['id']);
      cartUpdated.splice(index, 1);
      sessionStorage.setItem('cart', JSON.stringify(cartUpdated));
      this.cartUpdate.next(cartUpdated);
    }
  }

  public updateCount(item: Record<string, any>): void {
    const cart = sessionStorage.getItem('cart');
    if (cart) {
      let cartUpdated: Record<string, any>[] = JSON.parse(cart);
      const product = cartUpdated.find((cartItem) => item['id'] === cartItem['id']);
      if (product) {
        product['count'] = item['count'];
      }
      sessionStorage.setItem('cart', JSON.stringify(cartUpdated));
      this.cartUpdate.next(cartUpdated);
    }
  }
}
