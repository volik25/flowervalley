import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CartService } from '../../../_services/front/cart.service';
import { ProductItem } from '../../../_models/product-item';
import { ProductService } from '../../../_services/back/product.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Product } from '../../../_models/product';
import { LoadingService } from '../../../_services/front/loading.service';
import { BreadcrumbService } from '../../../components/breadcrumb/breadcrumb.service';
import { StorageService } from '../../../_services/front/storage.service';
import { CatalogService } from '../../../_services/back/catalog.service';
import { Category } from '../../../_models/category';
import { categoriesKey } from '../../../_utils/constants';
import { slugify } from 'transliteration';
import { EditProductComponent } from '../../../shared/product-item/edit-product/edit-product.component';
import { DialogService } from 'primeng/dynamicdialog';
import { AdminService } from '../../../_services/back/admin.service';
import { take } from 'rxjs/operators';

@Component({
  selector: 'flower-valley-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss'],
  providers: [DialogService],
})
export class ProductComponent implements OnInit {
  public isAdmin: boolean = false;

  public product: ProductItem | undefined;
  public category: Category | undefined;

  public categories: { src: string; link: string }[] = [];

  public products: ProductItem[] = [];

  public displayCustom: boolean = false;
  public activeIndex: number = 0;

  constructor(
    private cartService: CartService,
    private productService: ProductService,
    private storageService: StorageService,
    private catalogService: CatalogService,
    private dialogService: DialogService,
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private bs: BreadcrumbService,
    private ls: LoadingService,
    private adminService: AdminService,
  ) {
    this.adminService.checkAdmin().subscribe((isAdmin) => (this.isAdmin = isAdmin));
  }

  public ngOnInit(): void {
    this.route.params.subscribe((params) => {
      const id = params['id'];
      this.product = undefined;
      this.getProductById(id, params);
      this.setSharedButtons();
    });
  }

  private getProductById(id: string, params?: Params): void {
    const sub = this.productService.getItemById<Product>(id).subscribe((product) => {
      if (product) {
        this.product = {
          ...product,
          id: id,
          count: Number(product.coefficient) || 1,
          initialPrice: product.price,
        };
        const minPrice = this.product.prices.sort((price) => -price.price)[0];
        if (minPrice) {
          this.product.prices = this.product.prices.sort((price) => -price.countFrom);
          this.product.price = minPrice.price;
          this.product.count = minPrice.countFrom;
        }
        if (params) this.setCategories(params, product.name);
      }
      this.ls.removeSubscription(sub);
    });
    this.ls.addSubscription(sub);
  }

  public get step(): number {
    if (this.product?.coefficient) {
      return Number(this.product.coefficient);
    } else {
      return 1;
    }
  }

  public setCorrectCount(): void {
    if (this.product && this.product.count < this.step) {
      this.product.count = this.step;
    } else if (this.product && this.product.count / this.step !== 0) {
      this.product.count = Math.round(this.product.count / this.step) * this.step;
    }
  }

  public checkPrice(): void {
    if (this.product) this.product.price = this.product.initialPrice;
    this.product?.prices.map((price) => {
      if (this.product && this.product.count >= price.countFrom) this.product.price = price.price;
    });
  }

  public addToCart(): void {
    let price = this.product?.price;
    let initialPrice = this.product?.initialPrice;
    // @ts-ignore
    this.product.category = this.category;
    // @ts-ignore
    if (this.discount) {
      price = this.discount;
      initialPrice = this.discount;
    }
    // @ts-ignore
    this.cartService.addToCart({ ...this.product, price: price, initialPrice: initialPrice });
  }

  public get discount(): number | null {
    const sale = this.product?.sale;
    if (sale && sale.productId) {
      return sale.discount;
    }

    return null;
  }

  public get percentDiscount(): number | null {
    if (this.discount && this.product) {
      return 100 - Math.ceil((this.discount / this.product.price) * 100);
    }
    return null;
  }

  private setCategories(params: Params, productName: string): void {
    const categoryRoute = params['category'];
    let catalog = this.storageService.getItem<Category[]>(categoriesKey) || [];
    if (catalog.length) {
      const category = catalog.find((item) => slugify(item.name) === categoryRoute);
      if (category) {
        this.getProductsList(category, productName);
      } else if (categoryRoute === 'tulips') {
        const tulips = catalog.find((item) => item.id === 1);
        if (tulips) {
          this.getProductsList(tulips, productName);
        }
      }
    } else {
      const sub = this.catalogService.getItems().subscribe((categoriesApi) => {
        catalog = categoriesApi;
        this.storageService.setItem(categoriesKey, categoriesApi);
        const category = catalog.find((item) => slugify(item.name) === categoryRoute);
        if (category) {
          this.getProductsList(category, productName);
        } else if (categoryRoute === 'tulips') {
          const tulips = catalog.find((item) => item.id === 1);
          if (tulips) {
            this.getProductsList(tulips, productName);
          }
        }
        this.ls.removeSubscription(sub);
      });
      this.ls.addSubscription(sub);
    }
  }

  private getProductsList(category: Category, productName: string): void {
    this.category = category;
    this.bs.addItem(category.name);
    this.bs.addItem(productName, true);
    const sub = this.catalogService.getItemById<Category>(category.id).subscribe((categoryApi) => {
      this.products =
        categoryApi.products
          ?.filter((productItem) => productItem.id !== this.product?.id)
          .map((product) => {
            return {
              ...product,
              count: Number(product.coefficient) || 1,
              initialPrice: product.price,
            };
          }) || [];
      this.ls.removeSubscription(sub);
    });
    this.ls.addSubscription(sub);
  }

  public editProduct(): void {
    const modal = this.dialogService.open(EditProductComponent, {
      header: 'Редактировать товар',
      width: '600px',
      data: {
        product: this.product,
      },
    });
    modal.onClose.subscribe((res: { success: boolean }) => {
      if (res?.success && this.product?.id) this.getProductById(this.product.id);
    });
  }

  public getRouterLink(string: string): void {
    this.router.navigate(['catalog', slugify(string)], { relativeTo: this.route.parent?.parent });
  }

  public getOtherProduct(id: string): void {
    this.route.params.pipe(take(1)).subscribe((params) => {
      this.router.navigate(['catalog', params['category'], id]);
    });
  }

  public get isMobile(): boolean {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|mobile|CriOS/i.test(
      navigator.userAgent,
    );
  }

  private setSharedButtons(): void {
    if (this.isMobile) {
      this.categories = [
        {
          src: 'facebook',
          link: 'https://www.facebook.com/sharer.php?u=' + window.location.href,
        },
        {
          src: 'whatsapp',
          link: 'whatsapp://send?text=' + encodeURIComponent(window.location.href),
        },
        {
          src: 'vk',
          link: 'https://www.vk.com/share.php?url=' + window.location.href,
        },
        {
          src: 'telegram',
          link: 'https://telegram.me/share/url?url=' + window.location.href,
        },
        {
          src: 'viber',
          link: 'viber://forward?text=' + encodeURIComponent(window.location.href),
        },
      ];
    } else {
      this.categories = [
        {
          src: 'facebook',
          link: 'https://www.facebook.com/sharer.php?u=' + window.location.href,
        },
        {
          src: 'whatsapp',
          link: 'https://web.whatsapp.com/send?text=' + window.location.href,
        },
        {
          src: 'vk',
          link: 'https://www.vk.com/share.php?url=' + window.location.href,
        },
        {
          src: 'telegram',
          link: 'https://telegram.me/share/url?url=' + window.location.href,
        },
        {
          src: 'viber',
          link: 'viber://forward?text=' + encodeURIComponent(window.location.href),
        },
      ];
    }
  }

  public openImage(id: number): void {
    const index = this.product?.photos.findIndex((photo) => photo.id === id);
    if (index || index === 0) {
      this.activeIndex = index;
      this.displayCustom = true;
    }
  }
}
