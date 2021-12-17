import { Component } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { BreadcrumbService } from './breadcrumb.service';

@Component({
  selector: 'flower-valley-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.scss'],
  providers: [BreadcrumbService],
})
export class BreadcrumbComponent {
  private path: string | undefined;
  public parentPath: string | undefined;

  constructor(private route: ActivatedRoute, private _bs: BreadcrumbService) {
    this.path = this.getPath(route.snapshot);
    const parentSnapshot = route.parent?.snapshot;
    if (parentSnapshot) {
      this.parentPath = this.getPath(parentSnapshot);
    }
  }

  public items = [
    {
      title: 'Главная',
      routerLink: [''],
    },
    {
      title: 'Каталог',
      routerLink: ['', 'catalog'],
    },
    {
      title: 'Тюльпаны на 8 марта',
      routerLink: ['', 'tulips'],
    },
  ];

  private getPath(snapshot: ActivatedRouteSnapshot): string | undefined {
    if (snapshot.params) {
      return snapshot.url[0]?.path;
    } else {
      return snapshot.routeConfig?.path;
    }
  }

  public isActive(links: string[]): boolean {
    const path = links[links.length - 1];
    return this.path === path;
  }
}
