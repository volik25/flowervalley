import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CartService } from '../../_services/front/cart.service';
import { ProductItem } from '../../_models/product-item';
import { DialogService } from 'primeng/dynamicdialog';
import { EditProductComponent } from './edit-product/edit-product.component';
import { ProductService } from '../../_services/back/product.service';

@Component({
  selector: 'flower-valley-product-item',
  templateUrl: './product-item.component.html',
  styleUrls: ['./product-item.component.scss'],
  providers: [DialogService],
})
export class ProductItemComponent {
  @Input()
  public isAdmin: boolean = false;
  public get product(): ProductItem {
    return this._product;
  }
  @Input()
  public set product(value: ProductItem) {
    this._product = value;
  }
  private _product: any;

  @Output()
  public openProductCard: EventEmitter<any> = new EventEmitter<any>();
  @Output()
  private productUpdated: EventEmitter<any> = new EventEmitter<any>();
  @Output()
  private productDeleted: EventEmitter<any> = new EventEmitter<any>();
  constructor(
    private cartService: CartService,
    private ds: DialogService,
    private productService: ProductService,
  ) {}

  public increaseCount() {
    this.product.count += this.step;
  }

  public decreaseCount() {
    if (this.product.count <= this.step) return;
    this.product.count -= this.step;
  }

  public addToCart(): void {
    this.cartService.addToCart(this.product);
  }

  private get step(): number {
    if (this.product.coefficient) {
      return Number(this.product.coefficient);
    } else {
      return 1;
    }
  }

  public setCorrectCount(): void {
    if (this.product.count < this.step) {
      this.product.count = this.step;
    } else if (this.product.count / this.step !== 0) {
      this.product.count = Math.round(this.product.count / this.step) * this.step;
    }
  }

  public showEditProductModal(): void {
    const modal = this.ds.open(EditProductComponent, {
      header: 'Редактировать товар',
      width: '600px',
      data: {
        product: this.product,
      },
    });
    modal.onClose.subscribe((res: { success: boolean }) => {
      if (res?.success) this.productUpdated.emit();
    });
  }

  public deleteProduct(): void {
    if (this.product.id) {
      this.productService.deleteItem(this.product.id).subscribe(() => {
        this.productDeleted.emit();
      });
    }
  }
}
