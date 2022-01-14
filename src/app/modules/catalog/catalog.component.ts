import { Component, OnInit } from '@angular/core';
import { BreadcrumbService } from '../../components/breadcrumb/breadcrumb.service';
import { DialogService } from 'primeng/dynamicdialog';
import { AddCategoryComponent } from '../../shared/catalog-item/add-category/add-category.component';
import { CatalogService } from '../../_services/back/catalog.service';
import { Category } from '../../_models/category';
import { StorageService } from '../../_services/front/storage.service';
import { categoriesKey } from '../../_utils/constants';
import { AdminService } from '../../_services/back/admin.service';
import { LoadingService } from '../../_services/front/loading.service';

@Component({
  selector: 'flower-valley-catalog',
  templateUrl: './catalog.component.html',
  styleUrls: ['./catalog.component.scss'],
  providers: [DialogService],
})
export class CatalogComponent implements OnInit {
  public catalog: Category[] = [];
  public isAdmin: boolean = false;
  public draggedItem: Category | null = null;
  public draggedIndex: number | null = null;
  constructor(
    private bs: BreadcrumbService,
    private _ds: DialogService,
    private catalogService: CatalogService,
    private storageService: StorageService,
    private adminService: AdminService,
    private ls: LoadingService,
  ) {
    bs.setItem('Каталог');
    adminService.checkAdmin().subscribe((isAdmin) => (this.isAdmin = isAdmin));
  }

  public ngOnInit(): void {
    this.getCategories();
  }

  private getCategories(): void {
    const sub = this.catalogService.getItems().subscribe((categories) => {
      this.catalog = categories
        .filter((item) => !item.parentId)
        .sort((a, b) => a.categoryOrder - b.categoryOrder);
      this.storageService.setItem(categoriesKey, categories);
      this.ls.removeSubscription(sub);
    });
    this.ls.addSubscription(sub);
  }

  public addCategory(): void {
    const modal = this._ds.open(AddCategoryComponent, {
      header: 'Добавить раздел',
      width: '600px',
    });
    modal.onClose.subscribe((res: { success: boolean }) => {
      if (res?.success) this.getCategories();
    });
  }

  public updateCategoriesList(): void {
    this.getCategories();
  }

  public deleteCategory(id: number): void {
    const index = this.catalog.findIndex((category) => category.id === id);
    this.catalog.splice(index, 1);
  }

  public dragStart(category: Category, i: number): void {
    this.draggedIndex = i;
    this.draggedItem = category;
  }
  public dragEnd(): void {
    this.draggedItem = null;
  }
  public drop(i: number): void {
    if (this.draggedItem && (this.draggedIndex || this.draggedIndex === 0)) {
      const droppedItem = this.catalog[i];
      this.catalog[this.draggedIndex] = droppedItem;
      droppedItem.categoryOrder = this.draggedIndex;
      const draggedItem = this.draggedItem;
      this.catalog[i] = draggedItem;
      draggedItem.categoryOrder = i;
      [droppedItem, draggedItem].map((item) => {
        delete item.sale;
        this.catalogService.updateItem(item).subscribe();
      });
      this.draggedItem = null;
      this.draggedIndex = null;
    }
  }
}
