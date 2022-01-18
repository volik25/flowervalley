import { Component } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CatalogService } from '../../../_services/back/catalog.service';
import { Category } from '../../../_models/category';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { BusinessPackConverterService } from '../../../_services/back/business-pack-converter.service';
import { Product } from '../../../_models/product';
import { GoodsBusinessPack } from '../../../_models/business-pack/goods-base';
import { BusinessPackService } from '../../../_services/back/business-paсk.service';
import { ProductService } from '../../../_services/back/product.service';
import { Box } from '../../../_models/box';
import { BoxService } from '../../../_services/back/box.service';
import { isFormInvalid } from '../../../_utils/formValidCheck';

@Component({
  selector: 'flower-valley-edit-product',
  templateUrl: './edit-product.component.html',
  styleUrls: ['../add-product/add-product.component.scss'],
})
export class EditProductComponent {
  public isTulips: boolean;
  private deleteIds: number[] = [];
  public get isLoading(): boolean {
    return this._isLoading;
  }

  public set isLoading(value: boolean) {
    if (value) {
      this.goods.disable();
      this.productGroup.disable();
    } else {
      this.goods.enable();
      this.productGroup.enable();
    }
    this._isLoading = value;
  }
  private _isLoading: boolean = false;
  public goods: FormGroup;
  public productGroup: FormGroup;
  public product: Product;
  public categories: Category[] = [];
  public options = [
    { name: '', value: null },
    { name: 'шт', value: '00~Pvjh0000F' },
  ];
  public boxes: Box[] = [];
  private photos: File[] = [];
  constructor(
    private fb: FormBuilder,
    private catalogService: CatalogService,
    private productService: ProductService,
    private boxService: BoxService,
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
      Note1: [''],
      Note2: [''],
      Pack: [],
      Coefficient: [''],
    });
    this.productGroup = fb.group({
      isPopular: [false],
      description: ['', Validators.required],
      categoryIds: [null, Validators.required],
      boxId: [null, Validators.required],
      prices: this.fb.array([]),
    });
    this.product = config.data.product;
    this.isTulips = this.product.categories.find((item) => item.isTulip)?.isTulip || false;
    this.goods.patchValue(converter.convertToBase(this.product));
    this.productGroup.patchValue(this.product);
    this.catalogService.getItems().subscribe((items) => {
      this.categories = items;
      const categories = this.product.categories.map((category) => category.id);
      this.productGroup.controls['categoryIds'].setValue(categories);
      if (this.isTulips) {
        this.productGroup.controls['categoryIds'].disable();
        const category = this.product.categories.find((item) => item.isTulip);
        category?.steps?.map((step) => {
          const price = this.product.prices.find((item) => item.countFrom === step.countFrom);
          if (price) {
            this.addPriceRange({ price: price.price, countFrom: step.countFrom });
          } else {
            this.addPriceRange({ price: null, countFrom: step.countFrom });
          }
        });
      }
    });
    this.boxService.getItems().subscribe((boxes) => {
      this.boxes = boxes;
    });
  }

  public editProduct(): void {
    if (isFormInvalid(this.goods)) return;
    if (isFormInvalid(this.productGroup)) return;
    this.isLoading = true;
    const goods: GoodsBusinessPack = this.goods.getRawValue();
    const formData = new FormData();
    this.photos.map((photo) => {
      formData.append('photos[]', photo);
    });
    const productGroupValue = this.productGroup.getRawValue();
    productGroupValue.categoryIds.map((id: string) => {
      formData.append('categoryIds[]', id);
    });
    this.deleteIds.map((id) => {
      formData.append('deleteIds[]', id.toString());
    });
    this.bpService
      .updateGoods({
        ...goods,
        Object: this.product.id,
      })
      .subscribe((response) => {
        const id = response.Object;
        const product: any = {
          ...this.converter.convertToProduct(goods),
          description: productGroupValue.description,
          boxId: productGroupValue.boxId,
          isPopular: productGroupValue.isPopular,
          prices: productGroupValue.prices,
        };
        Object.getOwnPropertyNames(product).map((key) => {
          // @ts-ignore
          const value = product[key];
          if (key === 'prices') {
            value.map((price: any) => {
              formData.append(`${key}[]`, JSON.stringify(price));
            });
          } else formData.append(key, value);
        });
        this.productService.updateItem<any>(formData, id).subscribe(() => {
          this.isLoading = false;
          this.ref.close({ success: true });
        });
      });
  }

  public filesUploaded(photos: File[]): void {
    this.photos = photos;
  }
  public get prices(): FormArray {
    return this.productGroup.controls['prices'] as FormArray;
  }

  public getFormGroup(item: AbstractControl): FormGroup {
    return item as FormGroup;
  }

  public addPriceRange(step: { price: number | null; countFrom: number }): void {
    const control = this.fb.group({
      price: [null, Validators.required],
      countFrom: [null, Validators.required],
    });
    control.patchValue(step);
    control.controls['countFrom'].disable();
    this.prices.push(control);
  }

  public get isFormArrayValid(): boolean {
    return this.prices.status === 'VALID';
  }

  public removePhoto(id: number): void {
    this.deleteIds.push(id);
    const i = this.product.photos.findIndex((photo) => photo.id === id);
    this.product.photos.splice(i, 1);
  }
}
