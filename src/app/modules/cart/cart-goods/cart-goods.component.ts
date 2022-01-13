import { Component } from '@angular/core';
import { CartService } from '../../../_services/front/cart.service';
import { BoxGenerateService } from '../../../_services/front/box-generate.service';
import { Box } from '../../../_models/box';
import { ProductItem } from '../../../_models/product-item';

@Component({
  selector: 'flower-valley-cart-goods',
  templateUrl: './cart-goods.component.html',
  styleUrls: ['./cart-goods.component.scss'],
})
export class CartGoodsComponent {
  public goods: ProductItem[] = [];
  public boxes: Box[] = [];
  public minSummary = 17500;
  public isLoading: boolean = false;

  constructor(private cartService: CartService, private boxService: BoxGenerateService) {
    this.cartService.cartUpdate().subscribe((cart) => {
      this.goods = cart;
    });
    this.boxService.getBoxes().subscribe((boxes) => {
      this.boxes = boxes;
      this.isLoading = false;
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

  public updateCount(item: ProductItem): void {
    this.cartService.updateCount(item);
  }

  public getStep(item: ProductItem): number {
    if (item.coefficient) {
      return Number(item.coefficient);
    } else {
      return 1;
    }
  }

  public changeCount(item: ProductItem, count: number): void {
    const step = this.getStep(item);
    if (count < step) {
      item.count = step;
    } else if (count / step !== 0) {
      item.count = Math.round(count / step) * step;
    }
    this.cartService.updateCount(item);
  }

  public removeItem(id: string): void {
    this.cartService.removeFromCart(id);
    const index = this.goods.findIndex((cartItem) => id === cartItem.id);
    this.goods.splice(index, 1);
  }

  public genBoxes(): void {
    this.isLoading = true;
    this.boxService.genBoxes(this.goods);
  }

  public removeBoxes(): void {
    this.boxService.removeBoxes();
    this.boxes = [];
  }
}
