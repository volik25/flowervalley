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
  public clients: Client[] = [];
  public displayCustom: boolean = false;

  public activeIndex: number = 0;

  public openImage(id: number): void {
    this.activeIndex = this.clients.findIndex((item) => item.id === id);
    this.displayCustom = true;
  }
}
