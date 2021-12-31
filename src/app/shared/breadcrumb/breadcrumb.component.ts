import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { BreadcrumbService } from './breadcrumb.service';

@Component({
  selector: 'flower-valley-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.scss'],
})
export class BreadcrumbComponent implements OnInit {
  private readonly path: string | undefined;
  public items: any;
  public parentPath: string[] = [''];

  constructor(private route: ActivatedRoute, private _bS: BreadcrumbService) {
    this.path = BreadcrumbComponent.getPath(route.snapshot);
  }

  public ngOnInit(): void {
    this._bS.breadCrumbChanges().subscribe((res) => {
      this.items = res;
      if (this.items.length > 2) {
        this.parentPath = this.items[this.items.length - 2].routerLink;
      }
    });
  }

  private static getPath(snapshot: ActivatedRouteSnapshot): string | undefined {
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
