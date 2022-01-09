import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CartService } from '../../../_services/front/cart.service';
import { ProductItem } from '../../../_models/product-item';
import { ProductService } from '../../../_services/back/product.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Product } from '../../../_models/product';
import { LoadingService } from '../../../_services/front/loading.service';
import { BreadcrumbService } from '../../../shared/breadcrumb/breadcrumb.service';
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

  public categories = [
    {
      src: 'facebook',
      link: '',
    },
    {
      src: 'pinterest',
      link: '',
    },
    {
      src: 'whatsapp',
      link: '',
    },
    {
      src: 'vk',
      link: '',
    },
    {
      src: 'telegram',
      link: '',
    },
    {
      src: 'viber',
      link: '',
    },
  ];

  public products: ProductItem[] = [];

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
    });
  }

  private getProductById(id: string, params?: Params): void {
    const sub = this.productService.getItemById<Product>(id).subscribe((product) => {
      if (product) {
        this.product = {
          ...product,
          id: id,
          count: Number(product.coefficient) || 1,
        };
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

  public addToCart(): void {
    // @ts-ignore
    this.product.category = this.category;
    // @ts-ignore
    this.cartService.addToCart(this.product);
  }

  private setCategories(params: Params, productName: string): void {
    const categoryRoute = params['category'];
    let catalog = this.storageService.getItem<Category[]>(categoriesKey) || [];
    if (catalog.length) {
      const category = catalog.find((item) => slugify(item.name) === categoryRoute);
      if (category) {
        this.getProductsList(category, productName);
      }
    } else {
      const sub = this.catalogService.getItems().subscribe((categoriesApi) => {
        catalog = categoriesApi;
        this.storageService.setItem(categoriesKey, categoriesApi);
        const category = catalog.find((item) => slugify(item.name) === categoryRoute);
        if (category) {
          this.getProductsList(category, productName);
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
}
