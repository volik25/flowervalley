import { Component } from '@angular/core';
import { CartService } from '../../_services/front/cart.service';
import { ProductItem } from '../../_models/product-item';
import { BreadcrumbService } from '../../components/breadcrumb/breadcrumb.service';
import { AdminService } from '../../_services/back/admin.service';
import { DialogService } from 'primeng/dynamicdialog';
import { Router } from '@angular/router';

@Component({
  selector: 'flower-valley-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
  providers: [DialogService],
})
export class CartComponent {
  public goods: ProductItem[] = [];
  public isAdmin: boolean = false;
  constructor(
    private cartService: CartService,
    private adminService: AdminService,
    private router: Router,
    private _bs: BreadcrumbService,
  ) {
    adminService.checkAdmin().subscribe((isAdmin) => (this.isAdmin = isAdmin));
    cartService.cartUpdate().subscribe((goods) => {
      this.goods = goods;
    });
    _bs.setItem('Корзина');
  }

  public navigateToBoxes(): void {
    this.router.navigate(['admin/boxes']);
  }
}
