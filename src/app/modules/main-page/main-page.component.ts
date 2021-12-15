import { Component } from '@angular/core';
import { BackgroundType } from '../../components/container/background.enum';

@Component({
  selector: 'flower-valley-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss'],
})
export class MainPageComponent {
  public get backgroundEnum() {
    return BackgroundType;
  }

  public button = {
    title: 'Перейти в каталог',
    routerLink: ['/catalog'],
  };

  public footerButton = {
    ...this.button,
    icon: 'pi-arrow-right',
  };

  public catalog = [
    {
      title: 'Тюльпаны на 8 марта',
      img: 'assets/images/mocks/catalog/1.png',
      route: 'directory1',
    },
    {
      title: 'Рассада однолетних цветов',
      img: 'assets/images/mocks/catalog/2.png',
      route: 'directory2',
    },
    {
      title: 'Мнолетние растения',
      img: 'assets/images/mocks/catalog/3.png',
      route: 'directory3',
    },
    {
      title: 'Ампельные цветы в кашпо',
      img: 'assets/images/mocks/catalog/4.png',
      route: 'directory4',
    },
    {
      title: 'Ампельная рассада (укорененные черенки)',
      img: 'assets/images/mocks/catalog/5.png',
      route: 'directory5',
    },
    {
      title: 'Рассада овощей',
      img: 'assets/images/mocks/catalog/6.png',
      route: 'directory6',
    },
    {
      title: 'Рассада клубники и земляники',
      img: 'assets/images/mocks/catalog/7.png',
      route: 'directory7',
    },
    {
      title: 'Грунт питательный для цветов',
      img: 'assets/images/mocks/catalog/8.png',
      route: 'directory8',
    },
  ];

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
}
