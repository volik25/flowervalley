import { Component } from '@angular/core';
import { BreadcrumbService } from './shared/breadcrumb/breadcrumb.service';

@Component({
  selector: 'flower-valley-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [BreadcrumbService],
})
export class AppComponent {
  constructor(private _bs: BreadcrumbService) {}

  public get isShowBreadcrumb(): boolean {
    return this._bs.isShow;
  }
}
