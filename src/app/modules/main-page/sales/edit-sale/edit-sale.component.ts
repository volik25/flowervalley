import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Category } from '../../../../_models/category';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { CatalogService } from '../../../../_services/back/catalog.service';
import { SaleService } from '../../../../_services/back/sale.service';
import { isFormInvalid } from '../../../../_utils/formValidCheck';
import { Sale } from '../../../../_models/sale';
import { Product } from '../../../../_models/product';
import { ProductService } from '../../../../_services/back/product.service';

@Component({
  selector: 'flower-valley-edit-sale',
  templateUrl: './edit-sale.component.html',
  styleUrls: ['../add-sale/add-sale.component.scss'],
})
export class EditSaleComponent implements OnInit {
  public saleGroup: FormGroup;
  public isLoading: boolean = false;
  public sale!: Sale;
  public categories: Category[] = [];
  private photo: File | undefined;
  public selectedCategory: Category | undefined;
  public selectedProduct: Product | undefined;

  constructor(
    private fb: FormBuilder,
    private ref: DynamicDialogRef,
    private config: DynamicDialogConfig,
    private catalogService: CatalogService,
    private productService: ProductService,
    private saleService: SaleService,
  ) {
    this.sale = config.data.sale;
    this.saleGroup = fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      categoryId: [null, Validators.required],
      productId: [null],
      currentPrice: [{ value: null, disabled: true }],
      discount: [null, Validators.required],
    });
    this.saleGroup.controls['categoryId'].valueChanges.subscribe((id) => {
      if (this.selectedProduct) {
        this.saleGroup.controls['productId'].reset();
        this.saleGroup.controls['currentPrice'].reset();
        this.selectedProduct = undefined;
      }
      catalogService.getItemById<Category>(id).subscribe((category) => {
        this.selectedCategory = category;
      });
    });
    this.saleGroup.controls['productId'].valueChanges.subscribe((id) => {
      if (id) {
        this.selectedProduct = this.selectedCategory?.products?.find(
          (product) => product.id === id,
        );
        if (this.selectedProduct) {
          this.saleGroup.controls['currentPrice'].setValue(this.selectedProduct.price);
        } else {
          productService.getItemById<Product>(id).subscribe((product) => {
            this.selectedProduct = product;
            this.saleGroup.controls['currentPrice'].setValue(this.selectedProduct.price);
          });
        }
      } else {
        this.selectedProduct = undefined;
      }
    });
  }

  public ngOnInit(): void {
    this.catalogService.getItems().subscribe((items) => {
      this.categories = items.filter((item) => item.id !== 1).filter((item) => item.parentId !== 1);
      this.saleGroup.patchValue(this.sale);
    });
  }

  public addSale(): void {
    if (isFormInvalid(this.saleGroup)) return;
    this.isLoading = true;
    const sale = this.saleGroup.getRawValue();
    delete sale.currentPrice;
    if (!sale.productId) delete sale.productId;
    const formData = new FormData();
    Object.getOwnPropertyNames(sale).map((key) => {
      // @ts-ignore
      const value = sale[key];
      formData.append(key, value);
    });
    if (this.photo) {
      formData.append('img', this.photo);
    }
    this.saleService.updateItem<any>(formData, this.sale.id).subscribe(() => {
      this.isLoading = false;
      this.ref.close({ success: true });
    });
  }

  public filesUploaded(photos: File[]): void {
    this.photo = photos[0];
  }
}
