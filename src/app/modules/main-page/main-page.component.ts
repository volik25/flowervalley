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
}
