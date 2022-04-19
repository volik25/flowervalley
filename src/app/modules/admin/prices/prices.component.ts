import { Component, OnInit, ViewChild } from '@angular/core';
import { ProductService } from '../../../_services/back/product.service';
import { Product } from '../../../_models/product';
import { Table } from 'primeng/table';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { StaticDataService } from '../../../_services/back/static-data.service';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'flower-valley-prices',
  templateUrl: './prices.component.html',
  styleUrls: ['./prices.component.scss'],
})
export class PricesComponent implements OnInit {
  @ViewChild('pricesTable') public pricesTable: Table | undefined;
  public goods: Product[] = [];
  private clonedProducts: { [s: string]: Product } = {};
  private editedProducts: { [s: string]: Product } = {};
  public isLoading: boolean = false;
  public isButtonLoading: boolean = false;
  public textGroup: FormGroup;

  constructor(
    private productService: ProductService,
    private staticData: StaticDataService,
    private fb: FormBuilder,
    private ms: MessageService,
    private router: Router,
  ) {
    this.textGroup = fb.group({
      textTop: [''],
      textBottom: [''],
    });
  }

  public ngOnInit(): void {
    this.isLoading = true;
    this.staticData.getPriceListText().subscribe((priceListData) => {
      this.textGroup.patchValue(priceListData);
    });
    this.productService.getItems().subscribe((products) => {
      this.goods = products.filter((product) => product.categoryId !== 1);
      this.isLoading = false;
    });
  }

  public onRowEditInit(product: Product): void {
    if (product.id) this.clonedProducts[product.id] = { ...product };
  }

  public onRowEditSave(product: Product) {
    if (product.id) {
      delete this.clonedProducts[product.id];
      this.editedProducts[product.id] = { ...product };
    }
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
    const products = Object.values(this.editedProducts);
    let length = products.length;
    this.isButtonLoading = true;
    const pricesText = this.textGroup.getRawValue();
    this.staticData.setPriceListText(pricesText).subscribe(() => {
      if (length) {
        products.map((product) => {
          const prod: any = { ...product };
          delete prod.categoryId;
          delete prod.categoryName;
          delete prod.sale;
          this.productService.updateItem(prod).subscribe(() => {
            length--;
            if (length === 0) {
              this.showSuccessMessage();
            }
          });
        });
      } else {
        this.showSuccessMessage();
      }
    });
  }

  private showSuccessMessage(): void {
    this.ms.add({
      severity: 'success',
      summary: 'Публикация выполнена',
      detail: 'Прайс-лист обновлен',
    });
    this.isButtonLoading = false;
  }

  public createPriceList(): void {
    this.router.navigate(['admin/prices/individual']);
  }
}
