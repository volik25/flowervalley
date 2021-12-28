import { Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { BehaviorSubject, filter, map, Observable } from 'rxjs';
import { slugify } from 'transliteration';
import { Category } from '../../_models/category';

@Injectable()
export class BreadcrumbService {
  private url: string = '/';
  private _startUrl: string = '';
  private setUrlDuplicate: boolean = false;
  public backgroundChanges: BehaviorSubject<'light' | 'dark'> = new BehaviorSubject<
    'light' | 'dark'
  >('light');
  private items = [
    {
      title: 'Главная',
      routerLink: [''],
    },
  ];
  private _breadCrumbUpdate: BehaviorSubject<any> = new BehaviorSubject<any>(this.items);

  private _background: 'light' | 'dark' = 'light';

  public set background(value: 'light' | 'dark') {
    if (!this.setUrlDuplicate) {
      this._background = value;
      this.backgroundChanges.next(value);
    }
  }

  public get background(): 'light' | 'dark' {
    return this._background;
  }

  public get startUrl(): string {
    return this._startUrl;
  }

  public set startUrl(value: string) {
    if (value !== this._startUrl) {
      this.setUrlDuplicate = false;
      this._startUrl = value;
    } else {
      this.setUrlDuplicate = true;
    }
  }

  constructor(private router: Router) {
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

  public setItem(title: string): void {
    this._breadCrumbUpdate.next([
      ...this.items,
      {
        title: title,
        routerLink: [''],
      },
    ]);
  }

  public addItem(category?: Category): void {
    this._breadCrumbUpdate.next([
      ...this.items,
      {
        title: 'Каталог',
        routerLink: ['catalog'],
      },
      {
        title: category?.name,
        routerLink: [slugify(category?.name || '')],
      },
    ]);
  }

  public breadCrumbChanges(): Observable<any> {
    return this._breadCrumbUpdate.asObservable();
  }
}
