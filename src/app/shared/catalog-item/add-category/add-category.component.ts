import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Category } from '../../../_models/category';
import { CatalogService } from '../../../_services/back/catalog.service';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { isFormInvalid } from '../../../_utils/formValidCheck';

@Component({
  selector: 'flower-valley-add-category',
  templateUrl: './add-category.component.html',
  styleUrls: ['./add-category.component.scss'],
})
export class AddCategoryComponent {
  public category: FormGroup;
  public categories: Category[] = [];
  constructor(
    private fb: FormBuilder,
    private catalogService: CatalogService,
    private config: DynamicDialogConfig,
    public ref: DynamicDialogRef,
  ) {
    this.category = fb.group({
      name: ['', Validators.required],
      img: [''],
      parentId: [null],
    });
    const categoryId = config.data?.categoryId;
    catalogService.getItems().subscribe((items) => {
      this.categories = items.filter((item) => !item.parentId);
      if (categoryId) {
        this.category.controls['parentId'].setValue(categoryId);
      }
    });
  }

  public addCategory(): void {
    if (isFormInvalid(this.category)) return;
    const category: Category = this.category.getRawValue();
    if (!category.parentId) delete category.parentId;
    const formData = new FormData();
    Object.getOwnPropertyNames(category).map((key) => {
      if (key !== 'img') {
        // @ts-ignore
        const value = category[key];
        formData.append(key, value);
      }
    });
    formData.append('img', category.img);
    this.catalogService.addItem<any>(formData).subscribe((id) => {
      category.id = id;
      this.ref.close({ success: true });
    });
  }

  public photoUploaded(photos: File[]): void {
    this.category.get('img')?.setValue(photos[0]);
  }
}
