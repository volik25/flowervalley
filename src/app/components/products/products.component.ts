import { Component } from '@angular/core';

@Component({
  selector: 'flower-valley-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
})
export class ProductsComponent {
  public products = [
    {
      title: 'Примула ПИОНЕР ЕЛЛОУ ВИЗ АЙЗ',
      img: 'assets/images/mocks/products/1.png',
      id: 1,
      price: '100₽',
      count: 1,
    },
    {
      title: 'Лобелия РИВЬЕРА МАРИН БЛЮ',
      img: 'assets/images/mocks/products/2.png',
      id: 2,
      price: '16₽',
      count: 54,
    },
    {
      title: 'Петуния грандифлора УЛЬТРА БЛЮ СТАР',
      img: 'assets/images/mocks/products/3.png',
      id: 3,
      price: '20₽',
      count: 54,
    },
    {
      title: 'Лобелия РИВЬЕРА ВАЙТ',
      img: 'assets/images/mocks/products/4.png',
      id: 4,
      price: '16₽',
      count: 54,
    },
    {
      title: 'Лобелия РИВЬЕРА ВАЙТ',
      img: 'assets/images/mocks/products/4.png',
      id: 5,
      price: '16₽',
      count: 54,
    },
    {
      title: 'Петуния грандифлора УЛЬТРА БЛЮ СТАР',
      img: 'assets/images/mocks/products/3.png',
      id: 6,
      price: '20₽',
      count: 54,
    },
    {
      title: 'Лобелия РИВЬЕРА ВАЙТ',
      img: 'assets/images/mocks/products/4.png',
      id: 7,
      price: '16₽',
      count: 54,
    },
    {
      title: 'Примула ПИОНЕР ЕЛЛОУ ВИЗ АЙЗ',
      img: 'assets/images/mocks/products/1.png',
      id: 8,
      price: '100₽',
      count: 1,
    },
    {
      title: 'Петуния грандифлора УЛЬТРА БЛЮ СТАР',
      img: 'assets/images/mocks/products/3.png',
      id: 9,
      price: '20₽',
      count: 54,
    },
    {
      title: 'Лобелия РИВЬЕРА МАРИН БЛЮ',
      img: 'assets/images/mocks/products/2.png',
      id: 10,
      price: '16₽',
      count: 54,
    },
    {
      title: 'Примула ПИОНЕР ЕЛЛОУ ВИЗ АЙЗ',
      img: 'assets/images/mocks/products/1.png',
      id: 11,
      price: '100₽',
      count: 1,
    },
    {
      title: 'Лобелия РИВЬЕРА МАРИН БЛЮ',
      img: 'assets/images/mocks/products/2.png',
      id: 12,
      price: '16₽',
      count: 54,
    },
  ];

  public increaseCount(id: number) {
    const product = this.products.find((item) => item.id === id);
    if (product) product.count++;
  }

  public decreaseCount(id: number) {
    const product = this.products.find((item) => item.id === id);
    if (product) {
      if (product.count <= 1) return;
      product.count--;
    }
  }
}
