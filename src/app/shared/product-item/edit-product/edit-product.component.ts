import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CatalogService } from '../../../_services/back/catalog.service';
import { Category } from '../../../_models/category';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { BusinessPackConverterService } from '../../../_services/back/business-pack-converter.service';
import { Product } from '../../../_models/product';
import { GoodsBusinessPack } from '../../../_models/business-pack/goods-base';
import { BusinessPackService } from '../../../_services/back/business-paсk.service';
import { ProductService } from '../../../_services/back/product.service';

@Component({
  selector: 'flower-valley-edit-product',
  templateUrl: './edit-product.component.html',
  styleUrls: ['../add-product/add-product.component.scss'],
})
export class EditProductComponent {
  public goods: FormGroup;
  public productGroup: FormGroup;
  public product: Product;
  public categories: Category[] = [];
  public options = [
    { name: '', value: null },
    { name: 'шт', value: '00~Pvjh0000F' },
  ];
  private photos: File[] = [];
  constructor(
    private fb: FormBuilder,
    private catalogService: CatalogService,
    private productService: ProductService,
    private config: DynamicDialogConfig,
    private converter: BusinessPackConverterService,
    private bpService: BusinessPackService,
    private ref: DynamicDialogRef,
  ) {
    this.goods = fb.group({
      Name: ['', Validators.required],
      Price: ['', Validators.required],
      NDS: [0, Validators.required],
      NDSMode: [0, Validators.required],
      Volume: [],
      Pack: [],
      Coefficient: [''],
    });
    this.productGroup = fb.group({
      description: ['', Validators.required],
      categories: [],
    });
    this.product = config.data.product;
    this.goods.patchValue(converter.convertToBase(this.product));
    this.productGroup.patchValue(this.product);
    this.catalogService.getItems().subscribe((items) => {
      this.categories = items;
      this.productGroup.patchValue(this.product);
    });
  }

  public editProduct(): void {
    if (this.goods.invalid) return;
    const goods: GoodsBusinessPack = this.goods.getRawValue();
    const formData = new FormData();
    this.photos.map((photo) => {
      formData.append('photos[]', photo);
    });
    this.bpService.updateGoods(goods).subscribe((response) => {
      const id = response.Object;
      const product: any = {
        ...this.converter.convertToProduct(goods),
        id: id,
        description: this.productGroup.getRawValue().description,
      };
      Object.getOwnPropertyNames(product).map((key) => {
        // @ts-ignore
        const value = product[key];
        formData.append(key.toLowerCase(), value);
      });
      this.productService.updateItem<any>(formData).subscribe(() => {
        this.ref.close({ success: true });
      });
    });
  }

  public filesUploaded(photos: File[]): void {
    this.photos = photos;
  }
}
