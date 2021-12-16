import { Component } from '@angular/core';

@Component({
  selector: 'flower-valley-catalog',
  templateUrl: './catalog.component.html',
  styleUrls: ['./catalog.component.scss'],
})
export class CatalogComponent {
  public catalog = [
    {
      title: 'Тюльпаны на 8 марта',
      img: 'assets/images/mocks/catalog/1.png',
      route: 'tulips',
    },
    {
      title: 'Рассада однолетних цветов',
      img: 'assets/images/mocks/catalog/2.png',
      route: 'one-year-flowers',
    },
    {
      title: 'Мнолетние растения',
      img: 'assets/images/mocks/catalog/3.png',
      route: 'long-life-flowers',
    },
    {
      title: 'Ампельные цветы в кашпо',
      img: 'assets/images/mocks/catalog/4.png',
      route: 'ampels-flowers',
    },
    {
      title: 'Ампельная рассада (укорененные черенки)',
      img: 'assets/images/mocks/catalog/5.png',
      route: 'short-ampels-flowers',
    },
    {
      title: 'Рассада овощей',
      img: 'assets/images/mocks/catalog/6.png',
      route: 'vegetables',
    },
    {
      title: 'Рассада клубники и земляники',
      img: 'assets/images/mocks/catalog/7.png',
      route: 'strawberries',
    },
    {
      title: 'Грунт питательный для цветов',
      img: 'assets/images/mocks/catalog/8.png',
      route: 'priming',
    },
  ];
}
