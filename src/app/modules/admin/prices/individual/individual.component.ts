import { Component, OnInit } from '@angular/core';
import { CatalogService } from '../../../../_services/back/catalog.service';
import { Category } from '../../../../_models/category';
import { FormBuilder, FormControl } from '@angular/forms';
import { ProductService } from '../../../../_services/back/product.service';
import { forkJoin } from 'rxjs';
import { Product } from '../../../../_models/product';
import { PriceListGenerateService } from '../../../../_services/front/price-list-generate.service';

@Component({
  selector: 'flower-valley-individual',
  templateUrl: './individual.component.html',
  styleUrls: ['./individual.component.scss'],
})
export class IndividualComponent implements OnInit {
  public catalog: Category[] = [];
  public goods: Product[] = [];
  private clonedProducts: { [s: string]: Product } = {};
  public selectedGoods: Product[] = [];
  private selectedCategories: Category[] = [];
  public isLoading: boolean = false;
  public categoryControl: FormControl;
  constructor(
    private catalogService: CatalogService,
    private productService: ProductService,
    private pricesPDFService: PriceListGenerateService,
    private fb: FormBuilder,
  ) {
    this.categoryControl = fb.control('');
    this.categoryControl.valueChanges.subscribe((value) => {
      this.isLoading = true;
      this.selectedGoods = [];
      this.selectedCategories = value;
      value.map((category: any) => {
        const products = this.goods.filter((product) => product.categoryId === category.id);
        this.selectedGoods = this.selectedGoods.concat(products);
      });
      this.isLoading = false;
    });
  }

  ngOnInit(): void {
    const requests = [this.catalogService.getItems(true), this.productService.getItems()];
    forkJoin(requests).subscribe(([catalog, products]) => {
      this.catalog = catalog as Category[];
      this.goods = (products as Product[]).filter((product) => product.categoryId !== 1);
    });
  }

  public onRowEditInit(product: Product): void {
    if (product.id) this.clonedProducts[product.id] = { ...product };
  }

  public onRowEditSave(product: Product) {
    if (product.id) {
      const i = this.goods.findIndex((item) => item.id === product.id);
      this.goods[i] = product;
      delete this.clonedProducts[product.id];
    }
  }

  public onRowEditCancel(product: Product, index: number) {
    if (product.id) {
      this.goods[index] = this.clonedProducts[product.id];
      delete this.clonedProducts[product.id];
    }
  }

  public showPriceList(): void {
    this.pricesPDFService.generatePriceList(this.selectedCategories, this.selectedGoods);
  }
}
