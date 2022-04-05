import { Injectable } from '@angular/core';
import { MenuItem } from 'primeng/api';

@Injectable({
  providedIn: 'root',
})
export class StaticMenuService {
  private items: MenuItem[] = [
    {
      label: 'Главная',
      icon: 'pi pi-home',
      routerLink: '/admin/static-data',
      routerLinkActiveOptions: { exact: true },
    },
    {
      label: 'Header и Footer',
      icon: 'pi pi-align-center',
      routerLink: 'header-and-footer',
    },
    {
      label: 'Блок анимации',
      icon: 'pi pi-eye',
      routerLink: 'animation',
    },
    {
      label: 'О компании',
      icon: 'pi pi-info-circle',
      routerLink: 'about',
    },
    {
      label: 'Преимущества',
      icon: 'pi pi-bolt',
      routerLink: 'advantages',
    },
    {
      label: 'Блок в карточке товара',
      icon: 'pi pi-inbox',
      routerLink: 'product',
    },
    {
      label: 'Контакты',
      icon: 'pi pi-phone',
      routerLink: 'contacts',
    },
    {
      label: 'Корзина',
      icon: 'pi pi-shopping-cart',
      routerLink: 'cart',
    },
    {
      label: 'Прочее',
      icon: 'pi pi-sync',
      routerLink: 'other',
    },
  ];

  public getMenuItems(forTiles: boolean = false): MenuItem[] {
    if (forTiles) {
      return this.items.slice(1, this.items.length);
    } else {
      return this.items;
    }
  }
}
