import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MainBanner } from '../../../_models/main-banner';
import { DialogService } from 'primeng/dynamicdialog';
import { EditBannerComponent } from './edit-banner/edit-banner.component';

@Component({
  selector: 'flower-valley-banner',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.scss'],
  providers: [DialogService],
})
export class BannerComponent {
  @Input()
  public isAdmin: boolean = false;
  @Input()
  public banner: MainBanner | undefined;
  @Output()
  private bannerChanged: EventEmitter<any> = new EventEmitter<any>();
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

  constructor(private ds: DialogService) {}

  public openImage(src: string): void {
    this.activeIndex = this.photos.findIndex((photo) => photo.src === src);
    this.displayCustom = true;
  }

  public editBanner(): void {
    const editBannerModal = this.ds.open(EditBannerComponent, {
      header: 'Редактировать баннер',
      width: '600px',
      data: {
        banner: this.banner,
      },
    });
    editBannerModal.onClose.subscribe((res: { success: true }) => {
      if (res && res.success) {
        this.bannerChanged.emit();
      }
    });
  }
}
