import { Component, OnInit, ViewChild } from '@angular/core';
import { ProductService } from '../../../_services/back/product.service';
import { Product } from '../../../_models/product';
import { Table } from 'primeng/table';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';

@Component({
  selector: 'flower-valley-prices',
  templateUrl: './prices.component.html',
  styleUrls: ['./prices.component.scss'],
})
export class PricesComponent implements OnInit {
  @ViewChild('pricesTable') public pricesTable: Table | undefined;
  public goods: Product[] = [];
  private clonedProducts: { [s: string]: Product } = {};
  public isLoading: boolean = false;
  public isButtonLoading: boolean = false;

  constructor(
    private productService: ProductService,
    private ms: MessageService,
    private router: Router,
  ) {}

  public ngOnInit(): void {
    this.isLoading = true;
    this.productService.getItems().subscribe((products) => {
      this.goods = products.filter((product) => product.categoryId !== 1);
      this.isLoading = false;
    });
  }

  public onRowEditInit(product: Product): void {
    if (product.id) this.clonedProducts[product.id] = { ...product };
  }

  public onRowEditSave(product: Product) {
    if (product.id) delete this.clonedProducts[product.id];
  }

  public onRowEditCancel(product: Product, index: number) {
    if (product.id) {
      this.goods[index] = this.clonedProducts[product.id];
      delete this.clonedProducts[product.id];
    }
  }

  public filterTableData(event: any): void {
    this.pricesTable?.filterGlobal(event.target.value, 'contains');
  }

  public publishPriceList(): void {
    let length = this.goods.length;
    this.isButtonLoading = true;
    this.goods.map((product) => {
      const prod: any = { ...product };
      delete prod.categoryId;
      delete prod.categoryName;
      delete prod.sale;
      this.productService.updateItem(prod).subscribe(() => {
        length--;
        if (length === 0) {
          this.ms.add({
            severity: 'success',
            summary: 'Публикация выполнена',
            detail: 'Прайс-лист обновлен',
          });
          this.isButtonLoading = false;
        }
      });
    });
  }

  public createPriceList(): void {
    this.router.navigate(['admin/prices/individual']);
  }
}
