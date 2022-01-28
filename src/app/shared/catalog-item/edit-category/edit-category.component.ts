import { Component } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
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
      isSeedling: [false],
      steps: fb.array([]),
    });
    catalogService.getItems().subscribe((items) => {
      if (this.category.isTulip) {
        this.catalogService.getItemById<Category>(this.category.id).subscribe((category) => {
          this.category.steps = category.steps;
          this.category.steps
            ?.sort((item) => item.countFrom)
            .map((step) => {
              this.addPriceRange(step);
            });
        });
      }
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
    formData.append('name', category.name);
    formData.append('parentId', category.parentId.toString());
    formData.append('img', category.img);
    formData.append('isSeedling', category.isSeedling.toString());
    this.catalogService.updateItem<any>(formData, this.category.id).subscribe(() => {
      if (this.category.isTulip) {
        this.catalogService.setSteps(this.category.id, { steps: category.steps || [] }).subscribe();
      }
      this.ref.close({ success: true });
    });
  }

  public photoUploaded(photos: File[]): void {
    this.categoryGroup.get('img')?.setValue(photos[0]);
  }

  public get steps(): FormArray {
    return this.categoryGroup.controls['steps'] as FormArray;
  }

  public getFormGroup(item: AbstractControl): FormGroup {
    return item as FormGroup;
  }

  public addPriceRange(step?: { id: number; countFrom: number }): void {
    const control = this.fb.group({
      countFrom: [null, Validators.required],
    });
    if (step) control.patchValue(step);
    this.steps.push(control);
  }

  public deletePriceRange(index: number): void {
    this.steps.removeAt(index);
  }

  public get isFormArrayValid(): boolean {
    return this.steps.status === 'VALID';
  }
}
