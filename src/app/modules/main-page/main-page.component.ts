import { Component } from '@angular/core';
import { ProductItem } from '../../_models/product-item';
import { AdminService } from '../../_services/back/admin.service';
import { DestroyService } from '../../_services/front/destroy.service';
import { takeUntil } from 'rxjs';

@Component({
  selector: 'flower-valley-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss'],
  providers: [DestroyService],
})
export class MainPageComponent {
  public isAdmin = false;
  constructor(private adminService: AdminService, $destroy: DestroyService) {
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

  public catalog = [];

  public products: ProductItem[] = [];
}
