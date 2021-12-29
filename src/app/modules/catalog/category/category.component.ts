import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Category } from '../../../_models/category';
import { BreadcrumbService } from '../../../shared/breadcrumb/breadcrumb.service';
import { DialogService } from 'primeng/dynamicdialog';
import { MenuItem } from 'primeng/api';
import { slugify } from 'transliteration';
import { CatalogService } from '../../../_services/back/catalog.service';
import { StorageService } from '../../../_services/front/storage.service';
import { categoriesKey } from '../../../_utils/constants';
import { AdminService } from '../../../_services/back/admin.service';
import { ProductItem } from '../../../_models/product-item';
import { AddProductComponent } from '../../../shared/product-item/add-product/add-product.component';
import { LoadingService } from '../../../_services/front/loading.service';

@Component({
  selector: 'flower-valley-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss'],
  providers: [DialogService],
})
export class CategoryComponent implements OnInit {
  public isAdmin: boolean = false;
  public category: Category | undefined;
  public catalog: Category[] = [];
  public products: ProductItem[] = [];
  public actions: MenuItem[] = [
    {
      label: 'Импорт из БизнесПак',
      icon: 'pi pi-upload',
      command: () => this.showAddProductModal(true),
    },
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private bs: BreadcrumbService,
    private ds: DialogService,
    private adminService: AdminService,
    private storageService: StorageService,
    private catalogService: CatalogService,
    private ls: LoadingService,
  ) {
    adminService.checkAdmin().subscribe((isAdmin) => {
      this.isAdmin = isAdmin;
    });
  }

  public ngOnInit(): void {
    this.route.params.subscribe((params) => {
      const categoryRoute = params['category'];
      this.catalog = this.storageService.getItem<Category[]>(categoriesKey) || [];
      if (this.catalog.length) {
        this.setCategories(categoryRoute);
      } else {
        const sub = this.catalogService.getItems().subscribe((categoriesApi) => {
          this.catalog = categoriesApi;
          this.storageService.setItem(categoriesKey, categoriesApi);
          this.setCategories(categoryRoute);
          this.ls.removeSubscription(sub);
        });
        this.ls.addSubscription(sub);
      }
    });
  }

  public navigateTo(id: number): void {
    this.router.navigate([id], { relativeTo: this.route });
  }

  public isActive(title: string): boolean {
    return this.category?.name === title;
  }

  public showAddProductModal(isImport: boolean = false): void {
    this.ds.open(AddProductComponent, {
      header: 'Добавить товар',
      width: '600px',
      data: {
        isImport: isImport,
      },
    });
  }

  public getRoute(name: string): string {
    return slugify(name);
  }

  private setCategories(categoryRoute: string): void {
    this.category = this.catalog.find((item) => slugify(item.name) === categoryRoute);
    this.bs.addItem(this.category);
    const sub = this.catalogService
      .getItemById<Category>(this.category?.id || 0)
      .subscribe((category) => {
        this.products =
          category.products?.map((product) => {
            return {
              ...product,
              count: Number(product.coefficient) || 1,
            };
          }) || [];
        this.ls.removeSubscription(sub);
      });
    this.ls.addSubscription(sub);
  }
}
