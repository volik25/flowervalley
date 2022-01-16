import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Category } from '../../../../_models/category';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { CatalogService } from '../../../../_services/back/catalog.service';
import { SaleService } from '../../../../_services/back/sale.service';
import { isFormInvalid } from '../../../../_utils/formValidCheck';
import { Sale } from '../../../../_models/sale';

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

  constructor(
    private fb: FormBuilder,
    private ref: DynamicDialogRef,
    private config: DynamicDialogConfig,
    private catalogService: CatalogService,
    private saleService: SaleService,
  ) {
    this.sale = config.data.sale;
    this.saleGroup = fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      categoryId: [null, Validators.required],
    });
  }

  public ngOnInit(): void {
    this.catalogService.getItems().subscribe((items) => {
      this.categories = items;
      this.saleGroup.patchValue(this.sale);
    });
  }

  public addSale(): void {
    if (isFormInvalid(this.saleGroup)) return;
    this.isLoading = true;
    const sale = this.saleGroup.getRawValue();
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
