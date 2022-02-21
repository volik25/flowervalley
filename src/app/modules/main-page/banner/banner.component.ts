import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MainBanner } from '../../../_models/main-banner';
import { Router } from '@angular/router';
import { ThousandSeparatorPipe } from '../../../_pipes/thousand-separator.pipe';

@Component({
  selector: 'flower-valley-banner',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.scss'],
  providers: [ThousandSeparatorPipe],
})
export class BannerComponent {
  @Input()
  public isAdmin: boolean = false;
  @Input()
  public banner: MainBanner<unknown> | undefined;
  @Output()
  private bannerChanged: EventEmitter<any> = new EventEmitter<any>();
  public photos = [];
  public displayCustom: boolean = false;
  public showContent: boolean = false;

  public activeIndex: number = 0;

  constructor(private router: Router, private separator: ThousandSeparatorPipe) {}

  public openImage(id: number): void {
    this.activeIndex = this.banner?.photos.findIndex((photo) => photo.id === id) || 0;
    this.displayCustom = true;
  }

  public editBanner(): void {
    sessionStorage.setItem('banner', JSON.stringify(this.banner));
    this.router.navigate(['admin/edit/banner']);
  }

  private animateValue(obj: HTMLElement, end: number): void {
    let startTimestamp: number | null = null;
    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / 1000, 1);
      obj.innerHTML = this.separator.transform(Math.floor(progress * end)) || '0';
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }

  public startAnimation(elements: HTMLElement[]): void {
    elements.map((element) => {
      switch (element.id) {
        case 'clients':
          this.animateValue(element, 5800);
          break;
        case 'years':
          this.animateValue(element, 20);
          break;
        case 'cities':
          this.animateValue(element, 50);
          break;
        case 'flowers':
          this.animateValue(element, 1500000);
          break;
      }
    });
  }
}
