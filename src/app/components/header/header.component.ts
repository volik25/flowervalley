import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { CartService } from '../../_services/front/cart.service';
import { NavigationEnd, Router } from '@angular/router';
import { ProductItem } from '../../_models/product-item';
import { filter, map } from 'rxjs';
import { OverlayPanel } from 'primeng/overlaypanel';

@Component({
  selector: 'flower-valley-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  @ViewChild('headerMenu')
  private header!: ElementRef;
  @ViewChild('cartPanel')
  private cartPanel: OverlayPanel | undefined;
  @HostListener('window:scroll')
  private scrollTop() {
    if (this.cartPanel) this.cartPanel.hide();
    if (document.documentElement.scrollTop > 100) {
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

  constructor(private cartService: CartService, private router: Router) {
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
}
