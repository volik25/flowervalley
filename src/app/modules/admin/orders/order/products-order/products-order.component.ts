import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Product } from '../../../../../_models/product';
import { OrderProduct } from '../../../../../_models/order';
import { ProductService } from '../../../../../_services/back/product.service';
import { ConfirmationService } from 'primeng/api';

@Component({
  selector: 'flower-valley-products-order',
  templateUrl: './products-order.component.html',
  styleUrls: ['./products-order.component.scss'],
})
export class ProductsOrderComponent {
  public _orderProducts: OrderProduct[] = [];
  @Input()
  public get orderProducts(): OrderProduct[] {
    return this._orderProducts;
  }
  public set orderProducts(value: OrderProduct[]) {
    this._orderProducts = value;
    this.orderProductsChange.emit(this.orderProducts);
  }
  @Output()
  public orderProductsChange: EventEmitter<OrderProduct[]> = new EventEmitter<OrderProduct[]>();
  private clonedProducts: { [s: string]: OrderProduct } = {};
  public products: Product[] = [];
  private hidedProducts: Product[] = [];
  public isProductsLoading: boolean = false;
  public showProductSelect: boolean = false;
  constructor(private productService: ProductService, private cs: ConfirmationService) {}

  public showProductsDropdown(): void {
    if (this.products.length) {
      this.showProductSelect = true;
    } else {
      this.isProductsLoading = true;
      this.productService.getItems().subscribe((products) => {
        this.orderProducts.map((product) => {
          const index = products.findIndex((item) => item.id === product.product.id);
          this.hidedProducts.push(products[index]);
          products.splice(index, 1);
        });
        this.products = products;
        this.isProductsLoading = false;
        this.showProductSelect = true;
      });
    }
  }

  public addProduct(product: Product): void {
    this.orderProducts.push({
      // @ts-ignore
      id: product.id,
      count: Number(product.coefficient),
      price: product.price,
      product: product,
    });
    this.showProductSelect = false;
    const index = this.products.findIndex((item) => item.id === product.id);
    this.products.splice(index, 1);
    this.hidedProducts.push(product);
  }

  public onRowEditInit(product: OrderProduct): void {
    this.clonedProducts[product.id] = { ...product };
  }

  public onRowEditSave(product: OrderProduct, index: number) {
    this.orderProducts[index] = product;
    delete this.clonedProducts[product.id];
  }

  public onRowEditCancel(product: OrderProduct, index: number) {
    this.orderProducts[index] = this.clonedProducts[product.id];
    delete this.clonedProducts[product.id];
  }

  public deleteProduct(product: OrderProduct, index: number): void {
    this.cs.confirm({
      header: 'Подтвердите удаление товара',
      message: 'Вы действительно хотите удалить товар из заказа?',
      accept: () => {
        this.orderProducts.splice(index, 1);
        const rollBackProduct = this.hidedProducts.find((item) => item.id === product.product.id);
        if (rollBackProduct) {
          this.products.push(rollBackProduct);
        }
      },
    });
  }
}
