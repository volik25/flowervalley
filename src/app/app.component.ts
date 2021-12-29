import { ChangeDetectorRef, Component, HostListener } from '@angular/core';
import { BreadcrumbService } from './shared/breadcrumb/breadcrumb.service';
import { DialogService } from 'primeng/dynamicdialog';
import { SignInComponent } from './shared/sign-in/sign-in.component';
import { LoadingService } from './_services/front/loading.service';

@Component({
  selector: 'flower-valley-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [DialogService],
})
export class AppComponent {
  public cookieVisible = false;
  public background: 'light' | 'dark' = 'light';
  @HostListener('document:keydown.control.m')
  private doSth() {
    this._ds.open(SignInComponent, {
      header: 'Авторизация',
      width: '600px',
    });
  }
  constructor(
    private _bs: BreadcrumbService,
    private _ds: DialogService,
    public loadingService: LoadingService,
    private cdr: ChangeDetectorRef,
  ) {
    loadingService.changeDetectorRef = cdr;
    _bs.backgroundChanges.subscribe((background) => {
      this.background = background;
    });
  }

  public get isShowBreadcrumb(): boolean {
    return this._bs.isShow;
  }
}
