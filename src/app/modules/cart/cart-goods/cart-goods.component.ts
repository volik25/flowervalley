import { Component } from '@angular/core';
import { Product } from '../../../_models/product';
import { CartService } from '../../../services/cart.service';
import { BoxService } from '../../../services/box.service';
import { Box } from '../../../_models/box';

@Component({
  selector: 'flower-valley-cart-goods',
  templateUrl: './cart-goods.component.html',
  styleUrls: ['./cart-goods.component.scss'],
})
export class CartGoodsComponent {
  public goods: Product[] = [];
  public boxes: Box[] = [];
  public minSummary = 17500;

  constructor(private cartService: CartService, private boxService: BoxService) {
    this.goods = this.cartService.getCart();
    this.cartService.cartUpdate.subscribe((cart) => {
      this.goods = cart;
    });
  }

  public get getSum(): number {
    let sum = 0;
    this.goods.map((item) => (sum += item.price * item.count));
    return sum;
  }

  public get getDifference(): number {
    const diff = this.minSummary - this.getSum;
    if (diff > 0) {
      return diff;
    }
    return 0;
  }

  public increaseCount(item: Product) {
    item.count++;
    this.cartService.updateCount(item);
  }

  public decreaseCount(item: Product) {
    if (item.count <= 1) return;
    item.count--;
    this.cartService.updateCount(item);
  }

  public changeCount(item: Product, count: number): void {
    if (count <= 1) count = 1;
    item.count = count;
    this.cartService.updateCount(item);
  }

  public removeItem(id: number): void {
    this.cartService.removeFromCart(id);
    const index = this.goods.findIndex((cartItem) => id === cartItem.id);
    this.goods.splice(index, 1);
  }

  public genBoxes(): void {
    this.boxService.genBoxes();
    this.boxes = this.boxService.boxes;
  }

  public removeBoxes(): void {
    this.boxes = [];
  }
}
