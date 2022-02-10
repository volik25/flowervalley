import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Category } from '../../../../_models/category';
import { CatalogService } from '../../../../_services/back/catalog.service';
import { isFormInvalid } from '../../../../_utils/formValidCheck';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'flower-valley-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss'],
})
export class CategoryComponent {
  public category: FormGroup;
  public categories: Category[] = [];
  constructor(
    private fb: FormBuilder,
    private catalogService: CatalogService,
    private route: ActivatedRoute,
  ) {
    this.category = fb.group({
      name: ['', Validators.required],
      img: [''],
      parentId: [null],
      isSeedling: [false],
      isBlocked: [false],
    });
    route.queryParams.subscribe((params) => {
      const categoryId = params['categoryId'];
      catalogService.getItems().subscribe((items) => {
        this.categories = items.filter((item) => !item.parentId);
        if (categoryId) {
          this.category.controls['parentId'].setValue(Number(categoryId));
        }
      });
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
      // this.ref.close({ success: true });
    });
  }

  public photoUploaded(photos: File[]): void {
    this.category.get('img')?.setValue(photos[0]);
  }
}
