import { Component } from '@angular/core';
import { BusinessPackService } from '../../../_services/back/business-paсk.service';
import { AbstractControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GoodsBusinessPack } from '../../../_models/business-pack/goods-base';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ProductService } from '../../../_services/back/product.service';
import { BusinessPackConverterService } from '../../../_services/back/business-pack-converter.service';
import { CatalogService } from '../../../_services/back/catalog.service';
import { Category } from '../../../_models/category';
import { Box } from '../../../_models/box';
import { BoxService } from '../../../_services/back/box.service';
import { isFormInvalid } from '../../../_utils/formValidCheck';

@Component({
  selector: 'flower-valley-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.scss'],
})
export class AddProductComponent {
  public isTulips: boolean;
  public get isLoading(): boolean {
    return this._isLoading;
  }

  public set isLoading(value: boolean) {
    if (value) {
      this.goods.disable();
      this.product.disable();
    } else {
      this.goods.enable();
      this.product.enable();
    }
    this._isLoading = value;
  }
  private _isLoading: boolean = false;
  public businessPackResults: GoodsBusinessPack[] = [];
  public selectedProduct: GoodsBusinessPack | undefined;
  public categories: Category[] = [];
  public isImport: boolean = false;
  public goods: FormGroup;
  public product: FormGroup;
  private photos: File[] = [];
  public options = [
    { name: '', value: null },
    { name: 'шт', value: '00~Pvjh0000F' },
  ];
  public boxes: Box[] = [];
  constructor(
    private fb: FormBuilder,
    private bpService: BusinessPackService,
    private bpConverter: BusinessPackConverterService,
    private catalogService: CatalogService,
    private productService: ProductService,
    private boxService: BoxService,
    private config: DynamicDialogConfig,
    private ref: DynamicDialogRef,
  ) {
    this.isImport = config.data.isImport;
    const category = config.data?.category;
    this.isTulips = category.isTulip || false;
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
    this.product = fb.group({
      isPopular: [false],
      description: ['', Validators.required],
      categoryIds: [null, Validators.required],
      boxId: [null, Validators.required],
      prices: this.fb.array([]),
    });
    this.catalogService.getItems().subscribe((items) => {
      const parentId = category.parentId;
      if (parentId) {
        this.categories = items.filter((item) => item.parentId === parentId);
      } else {
        this.categories = items.filter((item) => !item.parentId);
      }
      this.product.controls['categoryIds'].setValue([category.id]);
      if (this.isTulips) {
        this.product.controls['categoryIds'].disable();
        this.catalogService.getItemById<Category>(category.id).subscribe(({ steps }) => {
          if (steps)
            steps.map((step) => {
              this.addPriceRange(step.countFrom);
            });
        });
      } else {
        const index = this.categories.findIndex((item) => item.isTulip);
        this.categories.splice(index, 1);
      }
    });
    this.boxService.getItems().subscribe((boxes) => {
      this.boxes = boxes;
    });
  }

  public addProduct(): void {
    if (isFormInvalid(this.goods)) return;
    if (isFormInvalid(this.product)) return;
    this.isLoading = true;
    const goods: GoodsBusinessPack = this.goods.getRawValue();
    const formData = new FormData();
    this.photos.map((photo) => {
      formData.append('photos[]', photo);
    });

    const productGroupValue = this.product.getRawValue();
    productGroupValue.categoryIds.map((id: string) => {
      formData.append('categoryIds[]', id);
    });
    if (this.isImport) {
      const updateGoods = {
        ...this.selectedProduct,
        ...goods,
      };
      this.bpService.updateGoods(updateGoods).subscribe((response) => {
        const id = response.Object;
        const product: any = {
          ...this.bpConverter.convertToProduct(updateGoods),
          id: id,
          description: productGroupValue.description,
          boxId: productGroupValue.boxId,
          isPopular: productGroupValue.isPopular,
          prices: productGroupValue.prices,
        };
        this.saveProduct(product, formData);
      });
    } else {
      this.bpService.createGoods(goods).subscribe((response) => {
        const id = response.Object;
        const product: any = {
          ...this.bpConverter.convertToProduct(goods),
          id: id,
          description: productGroupValue.description,
          boxId: productGroupValue.boxId,
          isPopular: productGroupValue.isPopular,
          prices: productGroupValue.prices,
        };
        this.saveProduct(product, formData);
      });
    }
  }

  private saveProduct(product: any, formData: FormData): void {
    Object.getOwnPropertyNames(product).map((key) => {
      // @ts-ignore
      const value = product[key];
      if (key === 'prices') {
        value.map((price: any) => {
          formData.append(`${key}[]`, JSON.stringify(price));
        });
      } else formData.append(key, value);
    });
    this.productService.addItem<any>(formData).subscribe(() => {
      this.isLoading = false;
      this.ref.close({ success: true });
    });
  }

  public searchItems(searchString: string): void {
    this.bpService.searchGoods(searchString).subscribe(({ items }) => {
      this.businessPackResults = items;
    });
  }

  public patchValue(): void {
    if (this.selectedProduct && this.selectedProduct.Object) {
      this.productService.getItemById(this.selectedProduct.Object).subscribe((product) => {
        if (product) {
          this.ref.close({ success: false, reject: true });
        } else {
          // @ts-ignore
          this.goods.patchValue(this.selectedProduct);
          this.goods.disable();
        }
      });
    } else {
      this.goods.reset();
      this.goods.enable();
      this.product.reset({ isPopular: false });
    }
  }

  public filesUploaded(photos: File[]): void {
    this.photos = photos;
  }

  public get prices(): FormArray {
    return this.product.controls['prices'] as FormArray;
  }

  public getFormGroup(item: AbstractControl): FormGroup {
    return item as FormGroup;
  }

  public addPriceRange(countFrom: number): void {
    const control = this.fb.group({
      price: [null, Validators.required],
      countFrom: [countFrom, Validators.required],
    });
    control.controls['countFrom'].disable();
    this.prices.push(control);
  }

  public get isFormArrayValid(): boolean {
    return this.prices.status === 'VALID';
  }
}
