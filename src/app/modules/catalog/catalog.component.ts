import { Component } from '@angular/core';
import { BreadcrumbService } from '../../shared/breadcrumb/breadcrumb.service';

@Component({
  selector: 'flower-valley-catalog',
  templateUrl: './catalog.component.html',
  styleUrls: ['./catalog.component.scss'],
})
export class CatalogComponent {
  constructor(private bs: BreadcrumbService) {
    bs.setItem('Каталог');
  }

  public catalog = [
    {
      title: 'Тюльпаны на 8 марта',
      img: 'assets/images/mocks/catalog/1.png',
      route: 'tyulpany',
    },
    {
      title: 'Рассада однолетних цветов',
      img: 'assets/images/mocks/catalog/2.png',
      route: 'tyulpany',
    },
    {
      title: 'Мнолетние растения',
      img: 'assets/images/mocks/catalog/3.png',
      route: 'tyulpany',
    },
    {
      title: 'Ампельные цветы в кашпо',
      img: 'assets/images/mocks/catalog/4.png',
      route: 'tyulpany',
    },
    {
      title: 'Ампельная рассада (укорененные черенки)',
      img: 'assets/images/mocks/catalog/5.png',
      route: 'tyulpany',
    },
    {
      title: 'Рассада овощей',
      img: 'assets/images/mocks/catalog/6.png',
      route: 'tyulpany',
    },
    {
      title: 'Рассада клубники и земляники',
      img: 'assets/images/mocks/catalog/7.png',
      route: 'tyulpany',
    },
    {
      title: 'Грунт питательный для цветов',
      img: 'assets/images/mocks/catalog/8.png',
      route: 'tyulpany',
    },
  ];
}
