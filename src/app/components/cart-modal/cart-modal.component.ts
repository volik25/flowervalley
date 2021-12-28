import { Component, Input } from '@angular/core';
import { CartService } from '../../_services/front/cart.service';
import { OverlayPanel } from 'primeng/overlaypanel';
import { ProductItem } from '../../_models/product-item';

@Component({
  selector: 'flower-valley-cart-modal',
  templateUrl: './cart-modal.component.html',
  styleUrls: ['./cart-modal.component.scss'],
})
export class CartModalComponent {
  @Input()
  public cart: ProductItem[] = [];

  constructor(private cartService: CartService, private _op: OverlayPanel) {}

  public get getSum(): number {
    let sum = 0;
    this.cart.map((cart) => (sum += cart.price * cart.count));
    return sum;
  }

  public hide(): void {
    this._op.hide();
  }

  public increaseCount(item: ProductItem) {
    item.count++;
    this.cartService.updateCount(item);
  }

  public decreaseCount(item: ProductItem) {
    if (item.count <= 1) return;
    item.count--;
    this.cartService.updateCount(item);
  }

  public changeCount(item: ProductItem, count: number): void {
    if (count <= 1) count = 1;
    item.count = count;
    this.cartService.updateCount(item);
  }

  public removeItem(id: string): void {
    this.cartService.removeFromCart(id);
    const index = this.cart.findIndex((cartItem) => id === cartItem.id);
    this.cart.splice(index, 1);
  }
}
