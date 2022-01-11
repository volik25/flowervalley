import { Component, Input } from '@angular/core';
import { Client } from '../../../_models/client';
import { responsiveOptions } from '../../../_utils/constants';

@Component({
  selector: 'flower-valley-clients',
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.scss'],
})
export class ClientsComponent {
  public responsiveOptions = responsiveOptions;
  @Input()
  public isAdmin: boolean = false;
  @Input()
  public clients: Client[] = [
    // {
    //   img: 'assets/images/mocks/clients/1.png',
    //   link: 'https://www.rzd.ru/',
    // },
    // {
    //   img: 'assets/images/mocks/clients/1.png',
    //   link: 'https://www.rzd.ru/',
    // },
    // {
    //   img: 'assets/images/mocks/clients/1.png',
    //   link: 'https://www.rzd.ru/',
    // },
    // {
    //   img: 'assets/images/mocks/clients/1.png',
    //   link: 'https://www.rzd.ru/',
    // },
    // {
    //   img: 'assets/images/mocks/clients/1.png',
    //   link: 'https://www.rzd.ru/',
    // },
    // {
    //   img: 'assets/images/mocks/clients/1.png',
    //   link: 'https://www.rzd.ru/',
    // },
  ];
}
