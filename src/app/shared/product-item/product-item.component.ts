import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { Product } from '../../_models/product';

@Component({
  selector: 'flower-valley-product-item',
  templateUrl: './product-item.component.html',
  styleUrls: ['./product-item.component.scss'],
})
export class ProductItemComponent {
  public get product(): Product {
    return this._product;
  }
  @Input()
  public set product(value: Product) {
    this._product = value;
  }
  private _product: any;

  @Output()
  public openProductCard: EventEmitter<any> = new EventEmitter<any>();
  constructor(private cartService: CartService) {}

  public increaseCount() {
    this.product.count++;
  }

  public decreaseCount() {
    if (this.product.count <= 1) return;
    this.product.count--;
  }

  public addToCart(): void {
    this.cartService.addToCart(this.product);
  }
}
