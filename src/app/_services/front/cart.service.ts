import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { ProductItem } from '../../_models/product-item';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  public readonly cartUpdate: Subject<ProductItem[]> = new Subject();

  public getCart(): ProductItem[] {
    const cart = sessionStorage.getItem('cart');
    if (cart) return JSON.parse(cart);
    return [];
  }

  public addToCart(item: ProductItem): void {
    const cart = sessionStorage.getItem('cart');
    if (cart) {
      let cartUpdated: ProductItem[] = JSON.parse(cart);
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

  public removeFromCart(id: string): void {
    const cart = sessionStorage.getItem('cart');
    if (cart) {
      let cartUpdated: ProductItem[] = JSON.parse(cart);
      const index = cartUpdated.findIndex((cartItem) => id === cartItem.id);
      cartUpdated.splice(index, 1);
      sessionStorage.setItem('cart', JSON.stringify(cartUpdated));
      this.cartUpdate.next(cartUpdated);
    }
  }

  public updateCount(item: ProductItem): void {
    const cart = sessionStorage.getItem('cart');
    if (cart) {
      let cartUpdated: ProductItem[] = JSON.parse(cart);
      const product = cartUpdated.find((cartItem) => item.id === cartItem.id);
      if (product) {
        product.count = item.count;
      }
      sessionStorage.setItem('cart', JSON.stringify(cartUpdated));
      this.cartUpdate.next(cartUpdated);
    }
  }
}
