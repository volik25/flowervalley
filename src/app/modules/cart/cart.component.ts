import { Component } from '@angular/core';
import { CartService } from '../../_services/front/cart.service';
import { ProductItem } from '../../_models/product-item';
import { BreadcrumbService } from '../../components/breadcrumb/breadcrumb.service';
import { AdminService } from '../../_services/back/admin.service';
import { MenuItem, MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { BoxesComponent } from '../../shared/boxes/boxes.component';
import { AddBoxComponent } from '../../shared/boxes/add-box/add-box.component';

@Component({
  selector: 'flower-valley-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
  providers: [DialogService],
})
export class CartComponent {
  public goods: ProductItem[] = [];
  public isAdmin: boolean = false;
  public actions: MenuItem[] = [
    {
      label: 'Добавить коробку',
      icon: 'pi pi-plus',
      command: () => this.showAddBoxModal(),
    },
  ];
  constructor(
    private cartService: CartService,
    private adminService: AdminService,
    private _bs: BreadcrumbService,
    private _ds: DialogService,
    private _ms: MessageService,
  ) {
    adminService.checkAdmin().subscribe((isAdmin) => (this.isAdmin = isAdmin));
    cartService.cartUpdate().subscribe((goods) => {
      this.goods = goods;
    });
    _bs.setItem('Корзина');
  }

  public showBoxesListModal(): void {
    this._ds.open(BoxesComponent, {
      header: 'Коробки транспортировочные',
      width: '1000px',
    });
  }

  private showAddBoxModal(): void {
    const modal = this._ds.open(AddBoxComponent, {
      header: 'Новая коробка',
      width: '600px',
    });
    modal.onClose.subscribe((res: { success: boolean }) => {
      if (res && res.success) {
        this._ms.add({
          severity: 'success',
          summary: 'Коробка добавлена',
        });
      }
    });
  }
}
