import { Component, Input, OnInit, TemplateRef, ViewEncapsulation } from '@angular/core';
import { BreadcrumbService } from '../breadcrumb/breadcrumb.service';
import { NavigationEnd, Router } from '@angular/router';
import { filter, map, takeUntil } from 'rxjs';
import { DestroyService } from '../../_services/front/destroy.service';

@Component({
  selector: 'flower-valley-container',
  templateUrl: './container.component.html',
  styleUrls: ['./container.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [DestroyService],
})
export class ContainerComponent implements OnInit {
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
  @Input()
  public isAdmin: boolean = false;
  @Input()
  // @ts-ignore
  public buttonTemplate: TemplateRef<any>;

  constructor(
    private bs: BreadcrumbService,
    private router: Router,
    private destroy$: DestroyService,
  ) {
    router.events
      .pipe(
        takeUntil(this.destroy$),
        filter((e) => e instanceof NavigationEnd),
        map((e) => e as NavigationEnd),
      )
      .subscribe((event) => {
        bs.startUrl = event.urlAfterRedirects;
      });
  }

  public ngOnInit(): void {
    this.bs.background = this.background;
  }
}
