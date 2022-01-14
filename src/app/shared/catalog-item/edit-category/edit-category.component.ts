import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Category } from '../../../_models/category';
import { CatalogService } from '../../../_services/back/catalog.service';
import { StorageService } from '../../../_services/front/storage.service';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'flower-valley-edit-category',
  templateUrl: './edit-category.component.html',
  styleUrls: ['../add-category/add-category.component.scss'],
})
export class EditCategoryComponent {
  public category: Category;
  public categoryGroup: FormGroup;
  public categories: Category[] = [];
  constructor(
    private fb: FormBuilder,
    private catalogService: CatalogService,
    private storeService: StorageService,
    private config: DynamicDialogConfig,
    private ref: DynamicDialogRef,
  ) {
    this.category = config.data.category;
    this.categoryGroup = fb.group({
      name: ['', Validators.required],
      img: [''],
      parentId: [null],
    });
    catalogService.getItems().subscribe((items) => {
      this.categories = items;
      this.categoryGroup.patchValue(this.category);
      if (!this.category.parentId) {
        this.categoryGroup.get('parentId')?.setValue(null);
      }
    });
  }

  public editCategory(): void {
    if (this.categoryGroup.invalid) return;
    const category: Category = this.categoryGroup.getRawValue();
    if (!category.parentId) category.parentId = 0;
    const formData = new FormData();
    Object.getOwnPropertyNames(category).map((key) => {
      if (key !== 'img') {
        // @ts-ignore
        const value = category[key];
        formData.append(key, value);
      }
    });
    formData.append('img', category.img);
    this.catalogService.updateItem<any>(formData, this.category.id).subscribe(() => {
      this.ref.close({ success: true });
    });
  }

  public photoUploaded(photos: File[]): void {
    this.categoryGroup.get('img')?.setValue(photos[0]);
  }
}
