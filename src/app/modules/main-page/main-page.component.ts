import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
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
import { DialogService } from 'primeng/dynamicdialog';
import { AddVideoComponent } from './video/add-video/add-video.component';
import { MenuItem, MessageService } from 'primeng/api';
import { ActivatedRoute, Router } from '@angular/router';
import { slugify } from 'transliteration';
import { Sale } from '../../_models/sale';
import { Banner } from '../../_models/banner';
import { EditReviewComponent } from './reviews/edit-review/edit-review.component';
import { EditClientComponent } from './clients/edit-client/edit-client.component';
import { SalesSettingsComponent } from './sales/settings/sales-settings.component';
import { AddSaleComponent } from './sales/add-sale/add-sale.component';

interface MainInfo {
  main: MainBanner<unknown>;
  videos: Video[];
  comments: MainBanner<unknown>;
  clients: MainBanner<unknown>;
  popular: ProductItem[];
  sales: MainBanner<Sale[]>;
}

@Component({
  selector: 'flower-valley-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss'],
  providers: [DestroyService, DialogService],
})
export class MainPageComponent implements OnInit {
  @ViewChild('about')
  public about!: ElementRef;
  public isAdmin = false;
  constructor(
    private adminService: AdminService,
    private catalogService: CatalogService,
    private mainInfoService: MainInfoService,
    private ls: LoadingService,
    private ds: DialogService,
    private ms: MessageService,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private route: ActivatedRoute,
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

  public saleSettings: MenuItem[] = [
    {
      label: 'Настройки карусели',
      icon: 'pi pi-pencil',
      command: () => this.editBannerOptions(),
    },
  ];

  public mainInfo: MainInfo | undefined;
  public catalog: Category[] = [];
  public categories: Category[] = [];
  public products: ProductItem[] = [];

  public ngOnInit(): void {
    const reqests = [this.mainInfoService.getMainInfo<MainInfo>(), this.catalogService.getItems()];
    const sub = forkJoin(reqests)
      .pipe(takeUntil(this.$destroy))
      .subscribe(([main, catalog]) => {
        // @ts-ignore
        (main as MainInfo).popular = (main as MainInfo).popular.map((product) => {
          return {
            ...product,
            count: product.coefficient || 1,
          };
        });
        this.mainInfo = main as MainInfo;
        this.categories = catalog as Category[];
        this.catalog = (catalog as Category[])
          .filter((item) => !item.parentId)
          .sort((a, b) => a.categoryOrder - b.categoryOrder);
        this.route.fragment.subscribe((fragment) => {
          setTimeout(() => {
            if (fragment === 'about')
              this.about?.nativeElement.scrollIntoView({ block: 'center', inline: 'center' });
          });
        });
        this.ls.removeSubscription(sub);
      });
    this.ls.addSubscription(sub);
  }

  public loadMainInfo(): void {
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

  public editFeedBack(): void {
    if (this.mainInfo) {
      const feedbackModal = this.ds.open(EditReviewComponent, {
        header: 'Редактировать отзывы',
        width: '600px',
        data: {
          review: this.mainInfo.comments,
        },
      });
      feedbackModal.onClose.pipe(takeUntil(this.$destroy)).subscribe((res: { success: true }) => {
        if (res && res.success) this.loadMainInfo();
      });
    }
  }

  public editClients(): void {
    if (this.mainInfo) {
      const clientModal = this.ds.open(EditClientComponent, {
        header: 'Редактировать клиентов',
        width: '600px',
        data: {
          client: this.mainInfo.clients,
        },
      });
      clientModal.onClose.pipe(takeUntil(this.$destroy)).subscribe((res: { success: true }) => {
        if (res && res.success) this.loadMainInfo();
      });
    }
  }

  public bannerChanged(): void {
    this.loadMainInfo();
    this.ms.add({
      severity: 'success',
      summary: 'Баннер обновлен',
    });
  }

  public navigateToProduct(id: string): void {
    const product = this.mainInfo?.popular.find((item) => item.id === id);
    if (product && product.categoryName) {
      this.router.navigate(['catalog', slugify(product.categoryName), id]);
    } else {
      this.ms.add({
        severity: 'error',
        summary: 'Произошла ошибка',
        detail: 'Товар был перемещен или удален',
      });
    }
  }

  public addSale(): void {
    if (this.mainInfo) {
      const saleModal = this.ds.open(AddSaleComponent, {
        header: 'Добавить акцию',
        width: '600px',
      });
      saleModal.onClose.pipe(takeUntil(this.$destroy)).subscribe((res: { success: true }) => {
        if (res && res.success) this.loadMainInfo();
      });
    }
  }

  public editBannerOptions(): void {
    if (this.mainInfo) {
      const { autoPlay, isUserCanLeaf } = this.mainInfo.sales;
      const modal = this.ds.open(SalesSettingsComponent, {
        header: 'Настройки карусели',
        width: '600px',
        data: <{ settings: Banner }>{
          settings: {
            autoPlay: autoPlay,
            isUserCanLeaf: isUserCanLeaf,
          },
        },
      });
      modal.onClose.subscribe((res: { success: boolean }) => {
        if (res && res.success) this.loadMainInfo();
      });
    }
  }

  public getCategory(categoryId: number | undefined): Category | undefined {
    return this.categories.find((category) => category.id === categoryId);
  }
}
