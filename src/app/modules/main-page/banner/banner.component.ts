import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MainBanner } from '../../../_models/main-banner';
import { Router } from '@angular/router';
import { ThousandSeparatorPipe } from '../../../_pipes/thousand-separator.pipe';
import { Animation } from '../../../_models/static-data/animation';

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
  @Input()
  public animations: Animation | undefined;
  @Output()
  private bannerChanged: EventEmitter<any> = new EventEmitter<any>();
  public photos = [];
  public displayCustom: boolean = false;
  public showContent: boolean = false;
  private isAnimated: boolean = false;
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
    if (!this.isAnimated && this.animations) {
      elements.map((element) => {
        switch (element.id) {
          case 'clients':
            // @ts-ignore
            this.animateValue(element, this.animations.firstNumber);
            break;
          case 'years':
            // @ts-ignore
            this.animateValue(element, this.animations.secondNumber);
            break;
          case 'cities':
            // @ts-ignore
            this.animateValue(element, this.animations.thirdNumber);
            break;
          case 'flowers':
            // @ts-ignore
            this.animateValue(element, this.animations.fourthNumber);
            break;
        }
      });
      this.isAnimated = true;
    }
  }
}
