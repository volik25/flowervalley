import { Injectable } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BreadcrumbService {
  private url: string = '/';

  constructor(private route: ActivatedRoute, private router: Router) {
    router.events
      .pipe(
        filter((e) => e instanceof NavigationEnd),
        map((e) => e as NavigationEnd),
      )
      .subscribe((event) => {
        this.url = event.urlAfterRedirects;
      });
  }

  public get isShow(): boolean {
    return this.url !== '/';
  }
}
