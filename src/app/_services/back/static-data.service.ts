import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { About } from '../../_models/static-data/about';
import { Advantages } from '../../_models/static-data/advantages';
import { Header } from '../../_models/static-data/header';
import { Contacts } from '../../_models/static-data/contacts';
import { Cart } from '../../_models/static-data/cart';

@Injectable({
  providedIn: 'root',
})
export class StaticDataService {
  protected baseUrl = environment.baseUrl;

  protected apiUrl = 'static-data';

  constructor(protected http: HttpClient) {}

  public getHeaderContent(): Observable<Header> {
    const header = {
      img: '',
      title: 'Агрофирма Цветочная Долина',
      subTitle: 'Тепличное хозяйство',
      workTime: '["Пн-Вс: с 9:00 до 20:00 без выходных и обеда."]',
      address:
        '["140125, Моск. обл., Раменский р-н., д. Островцы, ул. Подмосковная д. 22 A теплица 109"]',
      whatsAppNumber: '79151091000',
      phones: '["+79151091000"]',
      mail: '["flowervalley@mail.com"]',
    };
    return of(<Header>{
      ...header,
      workTime: JSON.parse(header.workTime),
      address: JSON.parse(header.address),
      phones: JSON.parse(header.phones),
      mail: JSON.parse(header.mail),
    });
  }

  public getAboutContent(): Observable<About> {
    // return this.http.get<About>(`${this.baseUrl}/${this.apiUrl}`);
    return of(<About>{
      img: 'assets/images/about.png',
      title: 'Тепличное хозяйство',
      subTitle: 'Агрофирма Цветочная Долина',
      description: `Тепличное хозяйство Агрофирма «Цветочная Долина» является признанным производителем цветочной
    продукции широкого ассортимента. Наш принцип - индивидуальный подход к клиенту и постоянный
    контроль качества продукции на каждом этапе выполнения работ.
    <br />
    <br />
    Наша Агрофирма старается удовлетворить запросы самых взыскательных клиентов, как
    профессионалов цветочного бизнеса, так и садоводов-любителей.
    <br />
    <br />
    Наш принцип - индивидуальный подход к клиенту и постоянный контроль качества продукции на
    каждом этапе выполнения работ.`,
    });
  }

  public getAdvantagesContent(): Observable<Advantages> {
    return of(<Advantages>{
      title: 'Преимущества',
      subTitle: 'Агрофирма цветочная долина',
      leftBlock: {
        img: 'assets/icons/advantages/greenhouse.svg',
        title: 'Собственное производство',
        description: `Ручное производство, длительная выгонка цветов, опытные специалисты, профессиональный
          подход к выращиванию цветов.`,
      },
      centerBlock: {
        img: 'assets/icons/advantages/flower.svg',
        title: 'Качество рассады',
        description: `Наша традиция – выращивание отборного, качественного тюльпана. Наш тюльпан – длиной до
          50-60 см, бокал до 8 см.`,
      },
      rightBlock: {
        img: 'assets/icons/advantages/wallet.svg',
        title: 'Оптимальные цены',
        description: `Тюльпаны Премиум 55-60 см высотой от 28р. Размер предоплаты составляет от 20% до 100%
          стоимости заказа по вашему желанию.`,
      },
    });
  }

  public getContactsContent(): Observable<Contacts> {
    const contacts = {
      workTime: '["Пн-Вс: с 9:00 до 20:00 без выходных и обеда."]',
      address:
        '["140125, Моск. обл., Раменский р-н., д. Островцы, ул. Подмосковная д. 22 A теплица 109"]',
      whatsAppNumber: '79151091000',
      phones: '["+79151091000", "+79031013401", "+79261651151"]',
      mail: '["flowervalley@mail.com"]',
    };
    return of(<Contacts>{
      ...contacts,
      workTime: JSON.parse(contacts.workTime),
      address: JSON.parse(contacts.address),
      phones: JSON.parse(contacts.phones),
      mail: JSON.parse(contacts.mail),
    });
  }

  public getCartContent(): Observable<Cart> {
    const cart = {
      minSumTitle: 'Минимальная сумма заказа через сайт -',
      minSumInfo: 'Без учета транспортировочных коробок и доставки',
      infoText: 'На меньшую сумму Вы можете приобрести наши товары только приехав к нам по адресу:',
      address:
        '["140125, Моск. обл., Раменский р-н., д. Островцы, ул. Подмосковная д. 22 A теплица 109"]',
      phones: '["+79151091000"]',
      mail: '["flowervalley@mail.com"]',
      callText: 'Звоните',
      writeText: 'или пишите',
      bannerTitle: 'Важно!',
      leftBannerBlock: {
        title: 'Рассада цветов',
        description:
          'Доставка по Москве: 2500 рублей, доставка по мо и в другие города: расчитывается индивидуально',
      },
      centerBannerBlock: {
        title: 'Тюльпаны срезка',
        description:
          'ВНИМАНИЕ! Доставка тюльпанов осуществляется сторонними транспортными компаниями по заказу покупателя. Агрофирма не осуществляет доставку тюльпанов',
      },
      rightBannerBlock: {
        title: 'Самовывоз',
        description:
          'Московская область, Раменский район, деревня Островцы, ул. Подмосковная 22А, теплица 109',
      },
    };
    return of(<Cart>{
      ...cart,
      address: JSON.parse(cart.address),
      phones: JSON.parse(cart.phones),
      mail: JSON.parse(cart.mail),
    });
  }

  public getVariables(): Observable<any> {
    return of({
      minPrice: 17500,
      cityDelivery: 2500,
      deliveryPerKm: 50,
      mobileWhatsApp: '79151091000',
      mobilePhone: '79151091000',
    });
  }
}
