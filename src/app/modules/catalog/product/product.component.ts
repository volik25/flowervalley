import { Component, OnInit } from '@angular/core';
import { CartService } from '../../../_services/front/cart.service';
import { ProductItem } from '../../../_models/product-item';
import { ProductService } from '../../../_services/back/product.service';
import { ActivatedRoute, Params } from '@angular/router';
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

@Component({
  selector: 'flower-valley-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss'],
  providers: [DialogService],
})
export class ProductComponent implements OnInit {
  public mainImage: number = 0;

  public isAdmin: boolean = false;

  // public product: ProductItem = {
  //   id: '1111',
  //   name: 'Кротон (Кодиеум) Петра (разветвленный)',
  //   photos: [
  //     'assets/images/mocks/product/1.png',
  //     'assets/images/mocks/product/1.png',
  //     'assets/images/mocks/product/1.png',
  //     'assets/images/mocks/product/1.png',
  //   ],
  //   note1: 'Горшок 19см',
  //   description:
  //     '«Petra» – уникальный сорт кротона, сегодня считающийся одним из наиболее известных и часто продаваемых. У этого растения крупные яйцевидные листья до 30 см в длину формируют компактную, удивительно орнаментальную крону. Отличительная черта сорта – доминирование только зеленого и желтого окрасов и очень толстые прожилки, расположенные по центру листовой пластины и отходящие от нее «ребрами» с выемчатым краем. Только на очень старых листьях кротона края листовой пластины и центральная жилка приобретают легкий красноватый тон.',
  //   categories: [
  //     {
  //       id: 1,
  //       name: 'Комнатные и горшечные',
  //     },
  //     {
  //       id: 2,
  //       name: 'Комнатные растения',
  //     },
  //   ],
  //   count: 1,
  //   price: 1800,
  // };

  public product: ProductItem | undefined;

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
    private bs: BreadcrumbService,
    private ls: LoadingService,
    private adminService: AdminService,
  ) {
    this.adminService.checkAdmin().subscribe((isAdmin) => (this.isAdmin = isAdmin));
  }

  public ngOnInit(): void {
    this.route.params.subscribe((params) => {
      const id = params['id'];
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

  // public get getMainImage(): string {
  //   return this.product.photos[this.mainImage];
  // }

  public increaseCount() {
    // @ts-ignore
    this.product.count++;
  }

  public decreaseCount() {
    // @ts-ignore
    if (this.product.count <= 1) return;
    // @ts-ignore
    this.product.count--;
  }

  public addToCart(): void {
    // @ts-ignore
    this.cartService.addToCart(this.product);
  }

  private setCategories(params: Params, productName: string): void {
    const categoryRoute = params['category'];
    let catalog = this.storageService.getItem<Category[]>(categoriesKey) || [];
    if (catalog.length) {
      const category = catalog.find((item) => slugify(item.name) === categoryRoute);
      if (category) {
        this.bs.addItem(category.name);
        this.bs.addItem(productName, true);
        const sub = this.catalogService
          .getItemById<Category>(category.id)
          .subscribe((categoryApi) => {
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
    } else {
      const sub = this.catalogService.getItems().subscribe((categoriesApi) => {
        catalog = categoriesApi;
        this.storageService.setItem(categoriesKey, categoriesApi);
        const category = catalog.find((item) => slugify(item.name) === categoryRoute);
        if (category) {
          this.bs.addItem(category.name);
          this.bs.addItem(productName, true);
          const subs = this.catalogService
            .getItemById<Category>(category.id)
            .subscribe((categoryApi) => {
              this.products =
                categoryApi.products
                  ?.filter((productItem) => productItem.id !== this.product?.id)
                  .map((product) => {
                    return {
                      ...product,
                      count: Number(product.coefficient) || 1,
                    };
                  }) || [];
              this.ls.removeSubscription(subs);
            });
          this.ls.addSubscription(subs);
        }
        this.ls.removeSubscription(sub);
      });
      this.ls.addSubscription(sub);
    }
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
}
