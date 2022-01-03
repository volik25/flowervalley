import { Component, Input } from '@angular/core';
import { CartService } from '../../../_services/front/cart.service';
import { Box } from '../../../_models/box';
import { BoxService } from '../../../_services/front/box.service';
import { DestroyService } from '../../../_services/front/destroy.service';
import { takeUntil } from 'rxjs';
import { ProductItem } from '../../../_models/product-item';

@Component({
  selector: 'flower-valley-confirmation-goods',
  templateUrl: './confirmation-goods.component.html',
  styleUrls: ['./confirmation-goods.component.scss'],
  providers: [DestroyService],
})
export class ConfirmationGoodsComponent {
  public goods: ProductItem[] = [];
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
