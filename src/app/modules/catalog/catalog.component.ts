import { Component } from '@angular/core';
import { BreadcrumbService } from '../../shared/breadcrumb/breadcrumb.service';
import { DialogService } from 'primeng/dynamicdialog';
import { AddCategoryComponent } from '../../shared/catalog-item/add-category/add-category.component';
import { CatalogService } from '../../_services/back/catalog.service';
import { Category } from '../../_models/category';
import { StorageService } from '../../_services/front/storage.service';
import { categoriesKey } from '../../_utils/constants';
import { AdminService } from '../../_services/back/admin.service';

@Component({
  selector: 'flower-valley-catalog',
  templateUrl: './catalog.component.html',
  styleUrls: ['./catalog.component.scss'],
  providers: [DialogService],
})
export class CatalogComponent {
  public catalog: Category[] = [];
  public isAdmin: boolean = false;

  constructor(
    private bs: BreadcrumbService,
    private _ds: DialogService,
    private catalogService: CatalogService,
    private storageService: StorageService,
    private adminService: AdminService,
  ) {
    bs.setItem('Каталог');
    catalogService.getItems().subscribe((categories) => {
      this.catalog = categories;
      storageService.setItem(categoriesKey, categories);
    });
    adminService.checkAdmin().subscribe((isAdmin) => (this.isAdmin = isAdmin));
  }

  public addCategory(): void {
    this._ds.open(AddCategoryComponent, {
      header: 'Добавить раздел',
      width: '600px',
    });
  }
}
