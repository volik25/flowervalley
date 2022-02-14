import { Component, OnInit, ViewChild } from '@angular/core';
import { ProductService } from '../../../_services/back/product.service';
import { Product } from '../../../_models/product';
import { Table } from 'primeng/table';

@Component({
  selector: 'flower-valley-prices',
  templateUrl: './prices.component.html',
  styleUrls: ['./prices.component.scss'],
})
export class PricesComponent implements OnInit {
  @ViewChild('pricesTable') public pricesTable: Table | undefined;
  public goods: Product[] = [];
  private clonedBoxes: { [s: string]: Product } = {};
  public isLoading: boolean = false;

  constructor(private productService: ProductService) {}

  public ngOnInit(): void {
    this.isLoading = true;
    this.productService.getItems().subscribe((products) => {
      this.goods = products;
      this.isLoading = false;
    });
  }

  public onRowEditInit(product: Product): void {
    if (product.id) this.clonedBoxes[product.id] = { ...product };
  }

  public onRowEditSave(product: Product) {
    const prod: any = { ...product };
    delete prod.categoryId;
    delete prod.categoryName;
    delete prod.sale;
    this.productService.updateItem(prod).subscribe(() => {
      if (product.id) delete this.clonedBoxes[product.id];
    });
  }

  public onRowEditCancel(product: Product, index: number) {
    if (product.id) {
      this.goods[index] = this.clonedBoxes[product.id];
      delete this.clonedBoxes[product.id];
    }
  }

  public filterTableData(event: any): void {
    this.pricesTable?.filterGlobal(event.target.value, 'contains');
  }
}
