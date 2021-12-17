import { Component } from '@angular/core';
import { BreadcrumbService } from './shared/breadcrumb/breadcrumb.service';

@Component({
  selector: 'flower-valley-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  public cookieVisible = false;
  public background: 'light' | 'dark' = 'light';

  constructor(private _bs: BreadcrumbService) {
    _bs.backgroundChanges.subscribe((background) => {
      this.background = background;
    });
  }

  public get isShowBreadcrumb(): boolean {
    return this._bs.isShow;
  }
}
