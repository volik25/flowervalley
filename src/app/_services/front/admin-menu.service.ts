import { Injectable } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { AdminService } from '../back/admin.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AdminMenuService {
  private items: MenuItem[] = [
    {
      icon: 'pi pi-home',
      routerLink: '/admin',
    },
    {
      label: 'Заказы',
      routerLink: 'orders',
      state: { description: 'Управление заказами' },
      icon: 'pi pi-shopping-cart',
    },
    {
      label: 'Коробки',
      routerLink: 'boxes',
      state: {
        description: 'Просмотр, редактирование, добавление и удаление транспортировочных коробок',
      },
      icon: 'pi pi-box',
    },
    {
      label: 'Статические данные',
      routerLink: 'static-data',
      state: { description: 'Редактирование статических данных' },
      icon: 'pi pi-database',
    },
    {
      label: 'Прайс-лист',
      routerLink: 'prices',
      state: { description: 'Редактирование прайс-листа' },
      icon: 'pi pi-file-pdf',
    },
    {
      label: 'Добавление данных',
      routerLink: 'add',
      state: { description: 'Добавление новых данных на сайт' },
      icon: 'pi pi-plus',
    },
    {
      label: 'Выйти',
      icon: 'pi pi-power-off',
      command: () => this.logout(),
    },
  ];

  constructor(private adminService: AdminService, private router: Router) {}

  public logout(): void {
    this.adminService.logOut().subscribe(() => {
      this.router.navigate(['']);
    });
  }

  public getMenuItems(forTiles: boolean = false): MenuItem[] {
    if (forTiles) {
      return this.items.slice(1, this.items.length - 1);
    } else {
      return this.items;
    }
  }
}
