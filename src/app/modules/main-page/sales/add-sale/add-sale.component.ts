import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Category } from '../../../../_models/category';
import { CatalogService } from '../../../../_services/back/catalog.service';
import { isFormInvalid } from '../../../../_utils/formValidCheck';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { SaleService } from '../../../../_services/back/sale.service';

@Component({
  selector: 'flower-valley-add-sale',
  templateUrl: './add-sale.component.html',
  styleUrls: ['./add-sale.component.scss'],
})
export class AddSaleComponent implements OnInit {
  public saleGroup: FormGroup;
  public isLoading: boolean = false;
  public categories: Category[] = [];
  private photo: File | undefined;

  constructor(
    private fb: FormBuilder,
    private ref: DynamicDialogRef,
    private catalogService: CatalogService,
    private saleService: SaleService,
  ) {
    this.saleGroup = fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      categoryId: [null, Validators.required],
    });
  }

  public ngOnInit(): void {
    this.catalogService.getItems().subscribe((items) => {
      this.categories = items;
    });
  }

  public addSale(): void {
    if (isFormInvalid(this.saleGroup)) return;
    const sale = this.saleGroup.getRawValue();
    const formData = new FormData();
    Object.getOwnPropertyNames(sale).map((key) => {
      // @ts-ignore
      const value = sale[key];
      formData.append(key, value);
    });
    if (!this.photo) return;
    formData.append('img', this.photo);
    this.saleService.addItem<any>(formData).subscribe(() => {
      this.ref.close({ success: true });
    });
  }

  public filesUploaded(photos: File[]): void {
    this.photo = photos[0];
  }
}
