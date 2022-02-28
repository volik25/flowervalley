import { Component, Input } from '@angular/core';
import { Footer } from '../../_models/static-data/header';

@Component({
  selector: 'flower-valley-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent {
  @Input()
  public footer: Footer | undefined;
  public goToPriceList(): void {
    window.open(
      'https://docs.google.com/spreadsheets/d/1TAcvsqVE7Q78MHaRoLw3XtiOn9P96A7Tk02GtrYwLho/edit#gid=669170734',
    );
  }
}
