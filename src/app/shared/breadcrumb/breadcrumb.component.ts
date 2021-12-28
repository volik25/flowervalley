import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { BreadcrumbService } from './breadcrumb.service';

@Component({
  selector: 'flower-valley-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.scss'],
})
export class BreadcrumbComponent implements OnInit {
  private path: string | undefined;
  public parentPath: string | undefined;
  public items: any;

  constructor(private route: ActivatedRoute, private _bS: BreadcrumbService) {
    this.path = this.getPath(route.snapshot);
    const parentSnapshot = route.parent?.snapshot;
    if (parentSnapshot) {
      this.parentPath = this.getPath(parentSnapshot);
    }
  }

  public ngOnInit(): void {
    this._bS.breadCrumbChanges().subscribe((res) => {
      this.items = res;
    });
  }

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
