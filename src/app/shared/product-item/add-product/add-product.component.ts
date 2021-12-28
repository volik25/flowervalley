import { Component } from '@angular/core';
import { BusinessPackService } from '../../../_services/back/business-paсk.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GoodsBusinessPack } from '../../../_models/business-pack/goods-base';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { ProductService } from '../../../_services/back/product.service';
import { BusinessPackConverterService } from '../../../_services/back/business-pack-converter.service';

@Component({
  selector: 'flower-valley-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.scss'],
})
export class AddProductComponent {
  public businessPackResults: GoodsBusinessPack[] = [];
  public selectedProduct: GoodsBusinessPack | undefined;
  public isImport: boolean = false;
  public goods: FormGroup;
  public product: FormGroup;
  private photos: File[] = [];
  public options = [
    { name: '', value: null },
    { name: 'шт', value: '00~Pvjh0000F' },
  ];
  constructor(
    private fb: FormBuilder,
    private bpService: BusinessPackService,
    private bpConverter: BusinessPackConverterService,
    private productService: ProductService,
    public config: DynamicDialogConfig,
  ) {
    this.isImport = config.data.isImport;
    this.goods = fb.group({
      Name: ['', Validators.required],
      Price: ['', Validators.required],
      NDS: [0, Validators.required],
      NDSMode: [0, Validators.required],
      Volume: [],
      Pack: [],
      Coefficient: [''],
    });
    this.product = fb.group({
      description: ['', Validators.required],
    });
  }

  public addProduct(): void {
    if (this.goods.invalid) return;
    const goods: GoodsBusinessPack = this.goods.getRawValue();
    const formData = new FormData();
    this.photos.map((photo) => {
      formData.append('photos[]', photo);
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
          description: this.product.getRawValue().description,
        };
        Object.getOwnPropertyNames(product).map((key) => {
          // @ts-ignore
          const value = product[key];
          formData.append(key.toLowerCase(), value);
        });
        this.productService.addItem<any>(formData).subscribe(() => {
          // console.log(res);
        });
      });
    } else {
      this.bpService.createGoods(goods).subscribe((response) => {
        const id = response.Object;
        const product: any = {
          ...this.bpConverter.convertToProduct(goods),
          id: id,
          description: this.product.getRawValue().description,
        };
        Object.getOwnPropertyNames(product).map((key) => {
          // @ts-ignore
          const value = product[key];
          formData.append(key.toLowerCase(), value);
        });
        this.productService.addItem<any>(formData).subscribe(() => {
          // console.log(res);
        });
      });
    }
  }

  public searchItems(searchString: string): void {
    this.bpService.searchGoods(searchString).subscribe(({ items }) => {
      this.businessPackResults = items;
    });
  }

  public patchValue(): void {
    if (this.selectedProduct) {
      this.goods.patchValue(this.selectedProduct);
    } else {
      this.goods.reset();
    }
  }

  public filesUploaded(photos: File[]): void {
    this.photos = photos;
  }
}
