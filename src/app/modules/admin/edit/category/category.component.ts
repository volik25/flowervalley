import { Component } from '@angular/core';
import { Category } from '../../../../_models/category';
import { AbstractControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CatalogService } from '../../../../_services/back/catalog.service';
import { ActivatedRoute } from '@angular/router';
import { take } from 'rxjs/operators';

@Component({
  selector: 'flower-valley-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss'],
})
export class CategoryComponent {
  public category?: Category;
  public categoryGroup: FormGroup;
  public categories: Category[] = [];
  constructor(
    private fb: FormBuilder,
    private catalogService: CatalogService,
    private route: ActivatedRoute,
  ) {
    this.categoryGroup = fb.group({
      name: ['', Validators.required],
      img: [''],
      parentId: [null],
      isSeedling: [false],
      isBlocked: [false],
      steps: fb.array([]),
    });
    route.params.subscribe((params) => {
      const categoryId = params['id'];
      catalogService
        .getItemById<Category>(categoryId)
        .pipe(take(1))
        .subscribe((category) => {
          this.category = category;
          this.getData(category);
        });
    });
  }

  private getData(category: Category): void {
    this.catalogService.getItems().subscribe((items) => {
      if (category.isTulip) {
        this.catalogService.getItemById<Category>(category.id).subscribe((categoryItem) => {
          category.steps = categoryItem.steps;
          category.steps
            ?.sort((item) => item.countFrom)
            .map((step) => {
              this.addPriceRange(step);
            });
        });
      }
      this.categories = items;
      this.categoryGroup.patchValue(category);
      if (category.isBlocked) {
        this.categoryGroup.controls['isBlocked'].setValue(true);
      }
      if (!category.parentId) {
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
    formData.append('isBlocked', category.isBlocked.toString());
    if (this.category?.id === 1) {
      formData.append('isTulip', 'true');
    }
    // @ts-ignore
    this.catalogService.updateItem<any>(formData, this.category.id).subscribe(() => {
      // @ts-ignore
      if (this.category.isTulip) {
        // @ts-ignore
        this.catalogService.setSteps(this.category.id, { steps: category.steps || [] }).subscribe();
      }
      // this.ref.close({ success: true });
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
