import { Component, OnInit } from '@angular/core';
import { CartService } from '../../_services/front/cart.service';
import { ProductItem } from '../../_models/product-item';
import { BreadcrumbService } from '../../components/breadcrumb/breadcrumb.service';
import { AdminService } from '../../_services/back/admin.service';
import { DialogService } from 'primeng/dynamicdialog';
import { Router } from '@angular/router';
import { DiscountService } from '../../_services/back/discount.service';
import { StaticDataService } from '../../_services/back/static-data.service';
import { Cart } from '../../_models/static-data/cart';
import { LoadingService } from '../../_services/front/loading.service';
import { forkJoin } from 'rxjs';
import { CartVariables } from '../../_models/static-data/variables';

@Component({
  selector: 'flower-valley-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
  providers: [DialogService],
})
export class CartComponent implements OnInit {
  public goods: ProductItem[] = [];
  public isAdmin: boolean = false;
  public cartContent: Cart | undefined;
  public cartVariables: CartVariables | undefined;
  public isMinSumReached: boolean = false;
  constructor(
    private cartService: CartService,
    private adminService: AdminService,
    private discountService: DiscountService,
    private staticData: StaticDataService,
    private router: Router,
    private ls: LoadingService,
    private _bs: BreadcrumbService,
  ) {
    adminService.checkAdmin().subscribe((isAdmin) => (this.isAdmin = isAdmin));
    cartService.cartUpdate().subscribe((goods) => {
      this.goods = goods;
    });
    _bs.setItem('Корзина');
  }

  public ngOnInit(): void {
    this.discountService.getItems().subscribe(() => {
      // console.log(res);
    });
    const cartRequests = [this.staticData.getCartContent(), this.staticData.getCartVariables()];
    const staticSub = forkJoin(cartRequests).subscribe(([cart, vars]) => {
      this.cartContent = cart as Cart;
      this.cartVariables = vars as CartVariables;
      this.ls.removeSubscription(staticSub);
    });
    this.ls.addSubscription(staticSub);
  }

  public navigateToBoxes(): void {
    this.router.navigate(['admin/boxes']);
  }
}
