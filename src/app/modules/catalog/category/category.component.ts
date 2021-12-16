import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'flower-valley-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss'],
})
export class CategoryComponent {
  public category: any | undefined;

  constructor(private route: ActivatedRoute, private router: Router) {
    route.params.subscribe((params) => {
      const categoryRoute = params['category'];
      this.category = this.catalog.find((item) => item.route === categoryRoute);
    });
  }

  public products = [
    {
      title: 'Примула ПИОНЕР ЕЛЛОУ ВИЗ АЙЗ',
      img: 'assets/images/mocks/products/1.png',
      id: 1,
      price: 100,
      count: 1,
    },
    {
      title: 'Лобелия РИВЬЕРА МАРИН БЛЮ',
      img: 'assets/images/mocks/products/2.png',
      id: 2,
      price: 16,
      count: 54,
    },
    {
      title: 'Петуния грандифлора УЛЬТРА БЛЮ СТАР',
      img: 'assets/images/mocks/products/3.png',
      id: 3,
      price: 20,
      count: 54,
    },
    {
      title: 'Лобелия РИВЬЕРА ВАЙТ',
      img: 'assets/images/mocks/products/4.png',
      id: 4,
      price: 16,
      count: 54,
    },
    {
      title: 'Лобелия РИВЬЕРА ВАЙТ',
      img: 'assets/images/mocks/products/4.png',
      id: 5,
      price: 16,
      count: 54,
    },
    {
      title: 'Петуния грандифлора УЛЬТРА БЛЮ СТАР',
      img: 'assets/images/mocks/products/3.png',
      id: 6,
      price: 20,
      count: 54,
    },
    {
      title: 'Лобелия РИВЬЕРА ВАЙТ',
      img: 'assets/images/mocks/products/4.png',
      id: 7,
      price: 16,
      count: 54,
    },
    {
      title: 'Примула ПИОНЕР ЕЛЛОУ ВИЗ АЙЗ',
      img: 'assets/images/mocks/products/1.png',
      id: 8,
      price: 100,
      count: 1,
    },
    {
      title: 'Петуния грандифлора УЛЬТРА БЛЮ СТАР',
      img: 'assets/images/mocks/products/3.png',
      id: 9,
      price: 20,
      count: 54,
    },
    {
      title: 'Лобелия РИВЬЕРА МАРИН БЛЮ',
      img: 'assets/images/mocks/products/2.png',
      id: 10,
      price: 16,
      count: 54,
    },
    {
      title: 'Примула ПИОНЕР ЕЛЛОУ ВИЗ АЙЗ',
      img: 'assets/images/mocks/products/1.png',
      id: 11,
      price: 100,
      count: 1,
    },
    {
      title: 'Лобелия РИВЬЕРА МАРИН БЛЮ',
      img: 'assets/images/mocks/products/2.png',
      id: 12,
      price: 16,
      count: 54,
    },
  ];

  public catalog = [
    {
      title: 'Тюльпаны на 8 марта',
      route: 'tulips',
    },
    {
      title: 'Рассада однолетних цветов',
      route: 'one-year-flowers',
    },
    {
      title: 'Мнолетние растения',
      route: 'long-life-flowers',
    },
    {
      title: 'Ампельные цветы в кашпо',
      route: 'ampels-flowers',
    },
    {
      title: 'Ампельная рассада (укорененные черенки)',
      route: 'short-ampels-flowers',
    },
    {
      title: 'Рассада овощей',
      route: 'vegetables',
    },
    {
      title: 'Рассада клубники и земляники',
      route: 'strawberries',
    },
    {
      title: 'Грунт питательный для цветов',
      route: 'priming',
    },
  ];

  public navigateTo(id: number): void {
    this.router.navigate([id], { relativeTo: this.route });
  }

  public isActive(title: string): boolean {
    return this.category.title === title;
  }
}
