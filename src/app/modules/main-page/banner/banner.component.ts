import { Component, Input } from '@angular/core';

@Component({
  selector: 'flower-valley-banner',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.scss'],
})
export class BannerComponent {
  @Input()
  public isAdmin: boolean = false;
  public photos = [
    {
      src: 'assets/images/strong-gold.png',
    },
    {
      src: 'assets/images/strong-gold.png',
    },
    {
      src: 'assets/images/strong-gold.png',
    },
    {
      src: 'assets/images/strong-gold.png',
    },
    {
      src: 'assets/images/strong-gold.png',
    },
    {
      src: 'assets/images/strong-gold.png',
    },
    {
      src: 'assets/images/strong-gold.png',
    },
  ];
  public displayCustom: boolean = false;

  public activeIndex: number = 0;

  public openImage(src: string): void {
    this.activeIndex = this.photos.findIndex((photo) => photo.src === src);
    this.displayCustom = true;
  }
}
