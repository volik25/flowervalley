import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MainBanner } from '../../../_models/main-banner';
import { Router } from '@angular/router';

@Component({
  selector: 'flower-valley-banner',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.scss'],
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

  constructor(private router: Router) {}

  public openImage(id: number): void {
    this.activeIndex = this.banner?.photos.findIndex((photo) => photo.id === id) || 0;
    this.displayCustom = true;
  }

  public editBanner(): void {
    sessionStorage.setItem('banner', JSON.stringify(this.banner));
    this.router.navigate(['admin/edit/banner']);
  }
}
