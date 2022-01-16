import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Category } from '../../../_models/category';
import { BreadcrumbService } from '../../../components/breadcrumb/breadcrumb.service';
import { DialogService } from 'primeng/dynamicdialog';
import { MenuItem, MessageService } from 'primeng/api';
import { slugify } from 'transliteration';
import { CatalogService } from '../../../_services/back/catalog.service';
import { StorageService } from '../../../_services/front/storage.service';
import { categoriesKey } from '../../../_utils/constants';
import { AdminService } from '../../../_services/back/admin.service';
import { ProductItem } from '../../../_models/product-item';
import { AddProductComponent } from '../../../shared/product-item/add-product/add-product.component';
import { LoadingService } from '../../../_services/front/loading.service';
import { AddCategoryComponent } from '../../../shared/catalog-item/add-category/add-category.component';

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
    {
      label: 'Добавить группу товаров',
      icon: 'pi pi-folder',
      command: () => this.showAddCategoryModal(),
    },
  ];
  public subCatalog: Category[] = [];
  public draggedItem: Category | null = null;
  public draggedIndex: number | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private bs: BreadcrumbService,
    private ds: DialogService,
    private adminService: AdminService,
    private storageService: StorageService,
    private catalogService: CatalogService,
    private ls: LoadingService,
    private messageService: MessageService,
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

  public showAddProductModal(isImport: boolean = false): void {
    const modal = this.ds.open(AddProductComponent, {
      header: 'Добавить товар',
      width: '600px',
      data: {
        isImport: isImport,
        category: this.category,
      },
    });
    modal.onClose.subscribe((res: { success: boolean; reject: boolean }) => {
      if (res) {
        if (res.success) {
          this.updateProducts();
        }
        if (res.reject) {
          this.messageService.add({
            severity: 'error',
            summary: 'Дублирование товара',
            detail: 'Данный товар уже добавлен в систему',
          });
        }
      }
    });
  }

  public showAddCategoryModal(): void {
    const modal = this.ds.open(AddCategoryComponent, {
      header: 'Добавить группу товаров',
      width: '600px',
      data: {
        categoryId: this.category?.id,
      },
    });
    modal.onClose.subscribe((res: { success: boolean }) => {
      if (res && res.success) {
        const sub = this.catalogService.getItems().subscribe((categoriesApi) => {
          this.catalog = categoriesApi;
          this.subCatalog = this.catalog
            .filter((item) => item.parentId === this.category?.id)
            .sort((a, b) => a.categoryOrder - b.categoryOrder);
          this.ls.removeSubscription(sub);
        });
        this.ls.addSubscription(sub);
      }
    });
  }

  private setCategories(categoryRoute: string): void {
    switch (categoryRoute) {
      case 'tulips':
        this.category = this.catalog.find((item) => item.id === 1);
        break;
      case 'flowers':
        this.category = this.catalog.find((item) => item.id === 2);
        break;
      default:
        this.category = this.catalog.find((item) => slugify(item.name) === categoryRoute);
        break;
    }
    this.subCatalog = this.catalog
      .filter((item) => item.parentId === this.category?.id)
      .sort((a, b) => a.categoryOrder - b.categoryOrder);
    this.updateProductsList();
  }

  private getCategories(id: number): void {
    const sub = this.catalogService.getItems().subscribe((categories) => {
      this.catalog = categories
        .filter((item) => (item.parentId = id))
        .sort((a, b) => a.categoryOrder - b.categoryOrder);
      this.storageService.setItem(categoriesKey, categories);
      this.ls.removeSubscription(sub);
    });
    this.ls.addSubscription(sub);
  }

  private updateProductsList(): void {
    if (this.category) {
      this.bs.addItem(this.category.name);
      const sub = this.catalogService
        .getItemById<Category>(this.category.id)
        .subscribe((category) => {
          this.products =
            category.products?.map((product) => {
              return {
                ...product,
                count: Number(product.coefficient) || 1,
                initialPrice: product.price,
              };
            }) || [];
          this.ls.removeSubscription(sub);
        });
      this.ls.addSubscription(sub);
    }
  }

  public updateProducts(): void {
    this.updateProductsList();
  }

  public deleteProduct(id?: string) {
    const index = this.products.findIndex((product) => product.id === id);
    this.products.splice(index, 1);
  }

  public updateCategoriesList(): void {
    if (this.category) this.getCategories(this.category.id);
  }

  public deleteCategory(id: number): void {
    const index = this.subCatalog.findIndex((category) => category.id === id);
    this.subCatalog.splice(index, 1);
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
      const droppedItem = this.subCatalog[i];
      this.subCatalog[this.draggedIndex] = droppedItem;
      droppedItem.categoryOrder = this.draggedIndex;
      const draggedItem = this.draggedItem;
      this.subCatalog[i] = draggedItem;
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
