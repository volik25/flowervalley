import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Category } from '../../../_models/category';
import { CatalogService } from '../../../_services/back/catalog.service';
import { StorageService } from '../../../_services/front/storage.service';
import { categoriesKey } from '../../../_utils/constants';

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
    private storeService: StorageService,
  ) {
    this.category = fb.group({
      name: ['', Validators.required],
      img: [''],
      parentId: [null],
    });
    catalogService.getItems().subscribe((items) => {
      this.categories = items;
    });
  }

  public addCategory(): void {
    if (this.category.invalid) return;
    const category: Category = this.category.getRawValue();
    this.catalogService.addItem<Category>(category).subscribe((res) => {
      category.id = res;
      this.categories.push(category);
      this.storeService.setItem(categoriesKey, this.categories);
    });
  }
}
