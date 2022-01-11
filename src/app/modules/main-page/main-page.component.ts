import { Component, OnInit } from '@angular/core';
import { ProductItem } from '../../_models/product-item';
import { AdminService } from '../../_services/back/admin.service';
import { DestroyService } from '../../_services/front/destroy.service';
import { forkJoin, takeUntil } from 'rxjs';
import { CatalogService } from '../../_services/back/catalog.service';
import { LoadingService } from '../../_services/front/loading.service';
import { Category } from '../../_models/category';
import { MainInfoService } from '../../_services/back/main-info.service';
import { Video } from '../../_models/video';
import { MainBanner } from '../../_models/main-banner';
import { Client } from '../../_models/client';
import { DialogService } from 'primeng/dynamicdialog';
import { AddVideoComponent } from './video/add-video/add-video.component';
import { MessageService } from 'primeng/api';
import { AddReviewComponent } from './reviews/add-review/add-review.component';
import { Feedback } from '../../_models/feedback';

interface MainInfo {
  main: MainBanner;
  videos: Video[];
  comments: Feedback[];
  clients: Client[];
}

@Component({
  selector: 'flower-valley-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss'],
  providers: [DestroyService, DialogService],
})
export class MainPageComponent implements OnInit {
  public isAdmin = false;
  constructor(
    private adminService: AdminService,
    private catalogService: CatalogService,
    private mainInfoService: MainInfoService,
    private ls: LoadingService,
    private ds: DialogService,
    private ms: MessageService,
    private $destroy: DestroyService,
  ) {
    adminService
      .checkAdmin()
      .pipe(takeUntil($destroy))
      .subscribe((isAdmin) => {
        this.isAdmin = isAdmin;
      });
  }

  public button = {
    title: 'Перейти в каталог',
    routerLink: ['/catalog'],
  };

  public footerButton = {
    ...this.button,
    icon: 'pi-arrow-right',
  };

  public mainInfo: MainInfo | undefined;
  public catalog: Category[] = [];
  public products: ProductItem[] = [];

  public ngOnInit(): void {
    const reqests = [this.mainInfoService.getMainInfo<MainInfo>(), this.catalogService.getItems()];
    const sub = forkJoin(reqests)
      .pipe(takeUntil(this.$destroy))
      .subscribe(([main, catalog]) => {
        this.mainInfo = main as MainInfo;
        this.catalog = catalog as Category[];
        this.ls.removeSubscription(sub);
      });
    this.ls.addSubscription(sub);
  }

  private loadMainInfo(): void {
    const sub = this.mainInfoService.getMainInfo<MainInfo>().subscribe((main) => {
      this.mainInfo = main;
      this.ls.removeSubscription(sub);
    });
    this.ls.addSubscription(sub);
  }

  public addVideo(): void {
    const videoModal = this.ds.open(AddVideoComponent, {
      header: 'Добавить видео',
      width: '600px',
    });
    videoModal.onClose
      .pipe(takeUntil(this.$destroy))
      .subscribe((res: { success: true; video: Video }) => {
        if (res && res.success) {
          if (this.mainInfo) {
            this.mainInfo.videos.push(res.video);
            this.ms.add({
              severity: 'success',
              summary: 'Видео добавлено!',
            });
          } else this.loadMainInfo();
        }
      });
  }

  public addFeedBack(): void {
    const feedbackModal = this.ds.open(AddReviewComponent, {
      header: 'Добавить отзыв',
      width: '600px',
    });
    feedbackModal.onClose.pipe(takeUntil(this.$destroy)).subscribe((res: { success: true }) => {
      if (res && res.success) this.loadMainInfo();
    });
  }
}
