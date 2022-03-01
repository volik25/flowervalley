import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CartService } from '../../../_services/front/cart.service';
import { BoxGenerateService } from '../../../_services/front/box-generate.service';
import { DestroyService } from '../../../_services/front/destroy.service';
import { takeUntil } from 'rxjs';
import { ProductItem } from '../../../_models/product-item';
import { PriceConverterPipe } from '../../../_pipes/price-converter.pipe';
import { BoxItem } from '../../../_models/box-item';
import { EstimateGenerateService } from '../../../_services/front/estimate-generate.service';

@Component({
  selector: 'flower-valley-confirmation-goods',
  templateUrl: './confirmation-goods.component.html',
  styleUrls: ['./confirmation-goods.component.scss'],
  providers: [DestroyService, EstimateGenerateService, PriceConverterPipe],
})
export class ConfirmationGoodsComponent {
  @Input()
  public goods: ProductItem[] = [];
  public boxes: BoxItem[] = [];
  @Input()
  public orderId: number | undefined;
  @Input()
  public shippingCost = 0;
  @Input()
  public pickUp: boolean = false;
  @Output()
  public orderSum: EventEmitter<number> = new EventEmitter<number>();
  constructor(
    private cartService: CartService,
    private boxService: BoxGenerateService,
    private estimateGenerate: EstimateGenerateService,
    private priceConvert: PriceConverterPipe,
    $destroy: DestroyService,
  ) {
    this.boxService
      .getBoxes()
      .pipe(takeUntil($destroy))
      .subscribe((boxes) => {
        this.boxes = boxes;
      });
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

  public get productsSum(): number {
    let sum = 0;
    this.goods.map((item) => (sum += item.price * item.count));
    return sum;
  }

  public get boxesSum(): number {
    let sum = 0;
    this.boxes.map((box) => (sum += box.count * box.price));
    return sum;
  }

  public get boxesCount(): number {
    let sum = 0;
    this.boxes.map((box) => (sum += box.count));
    return sum;
  }

  public getOrderSum(): number {
    const sum = this.productsSum + this.boxesSum + this.shippingCost;
    this.orderSum.emit(sum);
    return sum;
  }

  public getInvoice(): void {
    this.estimateGenerate.getClientPDF(
      ['Товар', 'Цена ₽', 'Количество', 'Стоимость ₽'],
      this.goods.map((goods) => [goods.name, goods.price, goods.count, goods.price * goods.count]),
      this.priceConvert.transform(this.shippingCost, 'two', 'rub'),
      this.priceConvert.transform(this.boxesSum, 'two', 'rub'),
      this.priceConvert.transform(this.productsSum, 'two', 'rub'),
      this.priceConvert.transform(this.getOrderSum(), 'two', 'rub'),
      this.orderId,
    );
  }
}
