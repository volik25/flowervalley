import {
  Component,
  ElementRef,
  HostListener,
  Input,
  OnInit,
  Renderer2,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { CartService } from '../../_services/front/cart.service';
import { NavigationEnd, Router } from '@angular/router';
import { ProductItem } from '../../_models/product-item';
import { filter, map } from 'rxjs';
import { OverlayPanel } from 'primeng/overlaypanel';
import { StorageService } from '../../_services/front/storage.service';
import { ProductService } from '../../_services/back/product.service';
import { PriceListGenerateService } from '../../_services/front/price-list-generate.service';
import { Header } from '../../_models/static-data/header';

@Component({
  selector: 'flower-valley-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  @Input()
  public headerData: Header | undefined;
  @ViewChild('menuBar')
  private menuBar: TemplateRef<ElementRef> | undefined;
  @ViewChild('menuBtn')
  private menuBtn: ElementRef | undefined;
  @ViewChild('header')
  private header!: ElementRef;
  @ViewChild('cartPanel')
  private cartPanel: OverlayPanel | undefined;
  @HostListener('window:scroll')
  private scrollTop() {
    if (this.cartPanel) this.cartPanel.hide();
    if (document.documentElement.scrollTop > 150) {
      this.header.nativeElement.classList.add('scrolled');
    } else {
      this.header.nativeElement.classList.remove('scrolled');
      if (this.isMenuToggle) this.isMenuToggle = false;
    }
  }
  public searchShow: boolean = false;
  public menuShow: boolean = false;
  public isMenuToggle: boolean = false;
  public cart: ProductItem[] = [];

  constructor(
    private renderer: Renderer2,
    private cartService: CartService,
    private storageService: StorageService,
    private productService: ProductService,
    private pricesPDFService: PriceListGenerateService,
    private router: Router,
  ) {
    router.events
      .pipe(
        filter((e) => e instanceof NavigationEnd),
        map((e) => e as NavigationEnd),
      )
      .subscribe(() => {
        this.isMenuToggle = false;
        this.menuShow = false;
        this.searchShow = false;
      });
    renderer.listen('document', 'click', (event: Event) => {
      if (
        this.isMenuToggle &&
        !this.menuBar?.elementRef.nativeElement.contains(event.target) &&
        !this.menuBtn?.nativeElement.contains(event.target)
      ) {
        this.isMenuToggle = false;
      }
    });
  }

  ngOnInit(): void {
    this.cartService.cartUpdate().subscribe((cart) => {
      this.cart = cart;
    });
  }

  public get getSum(): number {
    let sum = 0;
    this.cart?.map((cart) => (sum += cart.price * cart.count));
    return sum;
  }

  public get getCount(): number {
    return this.cart?.length || 0;
  }

  public goToCart(): void {
    this.router.navigate(['cart']);
  }

  public searchToggle(): void {
    this.menuShow = false;
    this.searchShow = !this.searchShow;
  }

  public menuToggle(): void {
    this.searchShow = false;
    this.menuShow = !this.menuShow;
  }

  public getPriceList(): void {
    const headers = ['Товар', 'Упаковка', 'Цена за шт.'];
    this.productService.getItems().subscribe((products) => {
      const pricesProducts = products.map((item) => [item.name, item.coefficient, item.price]);
      this.pricesPDFService.getPDF(headers, pricesProducts);
    });
  }
}
