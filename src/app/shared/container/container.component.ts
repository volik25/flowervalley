import { Component, Input, ViewEncapsulation } from '@angular/core';
import { BreadcrumbService } from '../breadcrumb/breadcrumb.service';
import { NavigationEnd, Router } from '@angular/router';
import { filter, map, takeUntil } from 'rxjs';
import { DestroyService } from '../../directives/destroy.service';

@Component({
  selector: 'flower-valley-container',
  templateUrl: './container.component.html',
  styleUrls: ['./container.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [DestroyService],
})
export class ContainerComponent {
  @Input()
  public headerTitle: string | undefined;
  @Input()
  public headerIcon: string | undefined;
  @Input()
  public headerIconImage: string | undefined;
  @Input()
  public background: 'light' | 'dark' = 'light';
  @Input()
  public headerButton: Record<string, any> | undefined;
  @Input()
  public footerButton: Record<string, any> | undefined;

  constructor(
    private bs: BreadcrumbService,
    private router: Router,
    private destroy$: DestroyService,
  ) {
    router.events
      .pipe(
        takeUntil(destroy$),
        filter((e) => e instanceof NavigationEnd),
        map((e) => e as NavigationEnd),
      )
      .subscribe((event) => {
        bs.startUrl = event.urlAfterRedirects;
        this.bs.background = this.background;
      });
  }
}
