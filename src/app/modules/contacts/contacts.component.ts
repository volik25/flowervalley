import { Component, HostListener, OnInit } from '@angular/core';
import { BreadcrumbService } from '../../shared/breadcrumb/breadcrumb.service';

@Component({
  selector: 'flower-valley-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.scss'],
})
export class ContactsComponent implements OnInit {
  public photosWidth: string = '';
  public mapWidth: string = '';
  @HostListener('window:resize')
  private updateWidth() {
    if (window.innerWidth < 380) {
      this.photosWidth = (window.innerWidth - 54).toString();
    } else {
      this.photosWidth = '380';
    }
    if (window.innerWidth < 550) {
      this.mapWidth = (window.innerWidth - 54).toString();
    } else {
      this.mapWidth = '550';
    }
  }
  public photos = [
    'assets/images/mocks/contacts/1.png',
    'assets/images/mocks/contacts/2.png',
    'assets/images/mocks/contacts/3.png',
    'assets/images/mocks/contacts/4.png',
    'assets/images/mocks/contacts/5.png',
    'assets/images/mocks/contacts/6.png',
  ];

  constructor(private _bs: BreadcrumbService) {
    _bs.setItem('Контакты');
  }

  public ngOnInit(): void {
    this.updateWidth();
  }
}
