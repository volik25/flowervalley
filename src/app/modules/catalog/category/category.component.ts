import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Category } from '../../../_models/category';
import { ProductItem } from '../../../_models/product-item';
import { BreadcrumbService } from '../../../shared/breadcrumb/breadcrumb.service';
import { DialogService } from 'primeng/dynamicdialog';
import { AddProductComponent } from '../../../shared/product-item/add-product/add-product.component';
import { MenuItem } from 'primeng/api';
import { slugify } from 'transliteration';
import { AdminService } from '../../../_services/back/admin.service';

@Component({
  selector: 'flower-valley-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss'],
  providers: [DialogService],
})
export class CategoryComponent {
  public isAdmin: boolean = false;
  public category: Category | undefined;
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
  ) {
    route.params.subscribe((params) => {
      const categoryRoute = params['category'];
      this.category = this.catalog.find((item) => slugify(item.name) === categoryRoute);
      bs.addItem(this.category);
    });
    adminService.checkAdmin().subscribe((isAdmin) => {
      this.isAdmin = isAdmin;
    });
  }

  public catalog: Category[] = [
    {
      name: 'Тюльпаны',
      id: 1,
    },
    {
      name: 'Цветы',
      id: 2,
    },
    {
      name: 'Растения',
      id: 3,
    },
  ];

  public products: ProductItem[] = [];

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
}
