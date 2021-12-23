import { Component, Input } from '@angular/core';
import { Product } from '../../../_models/product';
import { CartService } from '../../../services/cart.service';
import { Box } from '../../../_models/box';
import { BoxService } from '../../../services/box.service';
import { DestroyService } from '../../../services/destroy.service';
import { takeUntil } from 'rxjs';

@Component({
  selector: 'flower-valley-confirmation-goods',
  templateUrl: './confirmation-goods.component.html',
  styleUrls: ['./confirmation-goods.component.scss'],
  providers: [DestroyService],
})
export class ConfirmationGoodsComponent {
  public goods: Product[] = [];
  public boxes: Box[] = [];
  @Input()
  public shippingCost = 0;

  constructor(
    private cartService: CartService,
    private boxService: BoxService,
    $destroy: DestroyService,
  ) {
    this.goods = this.cartService.getCart();
    this.boxService
      .getBoxes()
      .pipe(takeUntil($destroy))
      .subscribe((boxes) => {
        this.boxes = boxes;
      });
    this.cartService.cartUpdate.subscribe((cart) => {
      this.goods = cart;
    });
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

  public get getSum(): number {
    let sum = 0;
    this.goods.map((item) => (sum += item.price * item.count));
    return sum;
  }

  public get getBoxesSum(): number {
    let sum = 0;
    this.boxes.map((box) => (sum += box.count * box.price));
    return sum;
  }

  public get getBoxesCount(): number {
    let sum = 0;
    this.boxes.map((box) => (sum += box.count));
    return sum;
  }
}
