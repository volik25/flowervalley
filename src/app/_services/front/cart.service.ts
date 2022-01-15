import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ProductItem } from '../../_models/product-item';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private readonly _cartUpdate: BehaviorSubject<ProductItem[]> = new BehaviorSubject<ProductItem[]>(
    CartService.getCart(),
  );

  public cartUpdate(): Observable<ProductItem[]> {
    return this._cartUpdate.asObservable();
  }

  private static getCart(): ProductItem[] {
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
        product.price = this.checkPrice(product);
      } else {
        cartUpdated.push(item);
      }
      sessionStorage.setItem('cart', JSON.stringify(cartUpdated));
      this._cartUpdate.next(cartUpdated);
    } else {
      sessionStorage.setItem('cart', JSON.stringify([item]));
      this._cartUpdate.next([item]);
    }
  }

  public removeFromCart(id: string): void {
    const cart = sessionStorage.getItem('cart');
    if (cart) {
      let cartUpdated: ProductItem[] = JSON.parse(cart);
      const index = cartUpdated.findIndex((cartItem) => id === cartItem.id);
      cartUpdated.splice(index, 1);
      sessionStorage.setItem('cart', JSON.stringify(cartUpdated));
      this._cartUpdate.next(cartUpdated);
    }
  }

  public updateCount(item: ProductItem): void {
    const cart = sessionStorage.getItem('cart');
    if (cart) {
      let cartUpdated: ProductItem[] = JSON.parse(cart);
      const product = cartUpdated.find((cartItem) => item.id === cartItem.id);
      if (product) {
        product.count = item.count;
        product.price = this.checkPrice(product);
      }
      sessionStorage.setItem('cart', JSON.stringify(cartUpdated));
      this._cartUpdate.next(cartUpdated);
    }
  }

  private checkPrice(product: ProductItem): number {
    if (product) product.price = product.initialPrice;
    product.prices.map((price) => {
      if (product && product.count >= price.countFrom) product.price = price.price;
    });
    return product.price;
  }
}
