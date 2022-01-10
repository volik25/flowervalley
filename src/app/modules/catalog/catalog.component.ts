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
      this.catalog = categories;
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
}
