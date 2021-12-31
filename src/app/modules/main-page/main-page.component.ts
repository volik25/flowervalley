import { Component, OnInit } from '@angular/core';
import { ProductItem } from '../../_models/product-item';
import { AdminService } from '../../_services/back/admin.service';
import { DestroyService } from '../../_services/front/destroy.service';
import { takeUntil } from 'rxjs';
import { CatalogService } from '../../_services/back/catalog.service';
import { LoadingService } from '../../_services/front/loading.service';
import { Category } from '../../_models/category';

@Component({
  selector: 'flower-valley-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss'],
  providers: [DestroyService],
})
export class MainPageComponent implements OnInit {
  public isAdmin = false;
  constructor(
    private adminService: AdminService,
    private catalogService: CatalogService,
    private ls: LoadingService,
    private $destroy: DestroyService,
  ) {
    adminService
      .checkAdmin()
      .pipe(takeUntil($destroy))
      .subscribe((isAdmin) => {
        this.isAdmin = isAdmin;
      });
  }

  public button = {
    title: 'Перейти в каталог',
    routerLink: ['/catalog'],
  };

  public footerButton = {
    ...this.button,
    icon: 'pi-arrow-right',
  };

  public ngOnInit(): void {
    const sub = this.catalogService
      .getItems()
      .pipe(takeUntil(this.$destroy))
      .subscribe((catalog) => {
        this.catalog = catalog;
        this.ls.removeSubscription(sub);
      });
    this.ls.addSubscription(sub);
  }

  public catalog: Category[] = [];

  public products: ProductItem[] = [];
}
