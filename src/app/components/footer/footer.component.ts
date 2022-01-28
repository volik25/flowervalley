import { Component } from '@angular/core';

@Component({
  selector: 'flower-valley-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent {
  public goToPriceList(): void {
    window.open(
      'https://docs.google.com/spreadsheets/d/1TAcvsqVE7Q78MHaRoLw3XtiOn9P96A7Tk02GtrYwLho/edit#gid=669170734',
    );
  }
}
