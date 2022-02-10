import { Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { BehaviorSubject, filter, map, Observable, Subject } from 'rxjs';
import { slugify } from 'transliteration';

@Injectable()
export class BreadcrumbService {
  private url: string = '/';
  private _startUrl: string = '';
  private setUrlDuplicate: boolean = false;
  public backgroundChanges: Subject<'light' | 'dark'> = new Subject<'light' | 'dark'>();
  private _initItems = [
    {
      title: 'Главная',
      routerLink: [''],
    },
  ];
  private items: { title: string; routerLink: string[] }[] = [];
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
    switch (this.url) {
      case '/':
        return false;
      case '/cart/download-invoice':
        return false;
      default:
        return !(this.url.includes('/#') || this.url.includes('admin'));
    }
  }

  public setItem(title: string): void {
    this._breadCrumbUpdate.next([
      ...this._initItems,
      {
        title: title,
        routerLink: [''],
      },
    ]);
  }

  public addItem(name: string, isProduct: boolean = false): void {
    if (isProduct) {
      this._breadCrumbUpdate.next([
        ...this.items,
        {
          title: name,
          routerLink: [slugify(name || '')],
        },
      ]);
    } else {
      this.items = [
        ...this._initItems,
        {
          title: 'Каталог',
          routerLink: ['catalog'],
        },
        {
          title: name,
          routerLink: ['catalog', slugify(name || '')],
        },
      ];
      this._breadCrumbUpdate.next([
        ...this._initItems,
        {
          title: 'Каталог',
          routerLink: ['catalog'],
        },
        {
          title: name,
          routerLink: ['catalog', slugify(name || '')],
        },
      ]);
    }
  }

  public breadCrumbChanges(): Observable<any> {
    return this._breadCrumbUpdate.asObservable();
  }
}
