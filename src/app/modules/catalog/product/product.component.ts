import { Component, OnInit } from '@angular/core';
import { CartService } from '../../../_services/front/cart.service';
import { ProductItem } from '../../../_models/product-item';
import { ProductService } from '../../../_services/back/product.service';
import { ActivatedRoute } from '@angular/router';
import { Product } from '../../../_models/product';
import { LoadingService } from '../../../_services/front/loading.service';

@Component({
  selector: 'flower-valley-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss'],
})
export class ProductComponent implements OnInit {
  public mainImage: number = 0;

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
    private route: ActivatedRoute,
    private ls: LoadingService,
  ) {}

  public ngOnInit(): void {
    this.route.params.subscribe((params) => {
      const id = params['id'];
      const sub = this.productService.getItemById<Product>(id).subscribe((product) => {
        this.product = {
          ...product,
          count: Number(product.coefficient) || 1,
        };
        this.ls.removeSubscription(sub);
      });
      this.ls.addSubscription(sub);
    });
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
}
