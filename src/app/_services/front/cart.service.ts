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
      cartUpdated = this.updateTulipPrices(cartUpdated);
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
      cartUpdated = this.updateTulipPrices(cartUpdated);
      sessionStorage.setItem('cart', JSON.stringify(cartUpdated));
      this._cartUpdate.next(cartUpdated);
    }
  }

  public clearCart(): void {
    const cart = sessionStorage.getItem('cart');
    if (cart) {
      sessionStorage.removeItem('cart');
      this._cartUpdate.next([]);
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
      cartUpdated = this.updateTulipPrices(cartUpdated);
      sessionStorage.setItem('cart', JSON.stringify(cartUpdated));
      this._cartUpdate.next(cartUpdated);
    }
  }

  private checkPrice(product: ProductItem, sum?: number): number {
    if (product) product.price = product.initialPrice;
    product.prices.map((price) => {
      if (sum) {
        if (product && sum >= price.countFrom) product.price = price.price;
      } else {
        if (product && product.count >= price.countFrom) product.price = price.price;
      }
    });
    return product.price;
  }

  public get isTulipsInclude(): boolean {
    return !!CartService.getCart().find((item) => item.categoryId === 1 || item.category?.id === 1);
  }

  private updateTulipPrices(cart: ProductItem[]): ProductItem[] {
    const tulips = cart.filter((item) => item.category?.id === 1);
    let sum = 0;
    tulips.map((item) => {
      sum += item.count;
    });
    tulips.map((item) => {
      item.price = this.checkPrice(item, sum);
      const index = cart.findIndex((cartItem) => cartItem.id === item.id);
      cart[index] = item;
    });
    return cart;
  }
}
