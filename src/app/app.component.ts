import { ChangeDetectorRef, Component, HostListener } from '@angular/core';
import { BreadcrumbService } from './components/breadcrumb/breadcrumb.service';
import { DialogService } from 'primeng/dynamicdialog';
import { SignInComponent } from './shared/sign-in/sign-in.component';
import { LoadingService } from './_services/front/loading.service';
import { NavigationStart, Router } from '@angular/router';
import { filter, map } from 'rxjs';
import { MessageService } from 'primeng/api';

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
  private showSignInModal() {
    const modal = this._ds.open(SignInComponent, {
      header: 'Авторизация',
      width: '600px',
    });
    modal.onClose.subscribe((result: { action: string }) => {
      switch (result?.action) {
        case 'sign-in':
          this.ms.add({
            severity: 'success',
            summary: 'Вход в систему',
            detail: 'Авторизация администратора выполнена',
          });
          break;
        case 'sign-out':
          this.ms.add({
            severity: 'success',
            summary: 'Выход из системы',
            detail: 'Возврат в клиентский режим выполнен',
          });
          break;
        default:
          break;
      }
    });
  }
  constructor(
    private _bs: BreadcrumbService,
    private _ds: DialogService,
    private ms: MessageService,
    public loadingService: LoadingService,
    private cdr: ChangeDetectorRef,
    private router: Router,
  ) {
    loadingService.changeDetectorRef = cdr;
    _bs.backgroundChanges.subscribe((background) => {
      this.background = background;
      cdr.detectChanges();
    });
    router.events
      .pipe(
        filter((e) => e instanceof NavigationStart),
        map((e) => e as NavigationStart),
      )
      .subscribe(() => {
        loadingService.cancelLoading();
      });
  }

  public get isShowBreadcrumb(): boolean {
    return this._bs.isShow;
  }
}
