import { Component, OnInit } from '@angular/core';
import { DiscountService } from '../../../_services/back/discount.service';
import { Router } from '@angular/router';
import { Discount } from '../../../_models/discount';
import { CatalogService } from '../../../_services/back/catalog.service';
import { BehaviorSubject, forkJoin } from 'rxjs';
import { Category } from '../../../_models/category';

@Component({
  selector: 'flower-valley-discount',
  templateUrl: './discount.component.html',
  styleUrls: ['./discount.component.scss'],
})
export class DiscountComponent implements OnInit {
  public discount: Discount[] = [];
  public catalog: Category[] = [];
  public selectedCategories: Category[] = [];
  private clonedDiscount: { [s: string]: Discount } = {};
  public isLoading = false;
  public requestProcessed = false;

  constructor(
    private discountService: DiscountService,
    private catalogService: CatalogService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.isLoading = true;
    const requests = [this.catalogService.getItems(true), this.discountService.getItems()];
    forkJoin(requests).subscribe(([catalog, discount]) => {
      this.discount = discount as Discount[];
      this.catalog = catalog as Category[];
      this.selectedCategories = this.catalog.filter((category) => !category.hasNoDiscount);
      this.isLoading = false;
    });
  }

  public deleteItem(id: number): void {
    this.isLoading = true;
    this.discountService.deleteItem(id).subscribe(() => {
      const index = this.discount.findIndex((discount) => discount.id === id);
      this.discount.splice(index, 1);
      this.isLoading = false;
    });
  }

  public navigateToAddDiscount(): void {
    this.router.navigate(['admin/add/discount']);
  }

  public onRowEditInit(discount: Discount): void {
    this.clonedDiscount[discount.id] = { ...discount };
  }

  public onRowEditSave(discount: Discount) {
    this.isLoading = true;
    this.discountService.updateItem(discount).subscribe(() => {
      delete this.clonedDiscount[discount.id];
      this.isLoading = false;
    });
  }

  public onRowEditCancel(discount: Discount, index: number) {
    this.discount[index] = this.clonedDiscount[discount.id];
    delete this.clonedDiscount[discount.id];
  }

  public saveCategories(): void {
    this.requestProcessed = true;
    const subscribe = new BehaviorSubject(this.catalog.length);
    this.catalog.map((category) => {
      const item = this.selectedCategories.find((selectedItem) => selectedItem.id === category.id);
      if (item) {
        category.hasNoDiscount = !category.hasNoDiscount;
      } else {
        category.hasNoDiscount = Boolean(category.hasNoDiscount);
      }
      this.catalogService.updateItem<Category>(category).subscribe(() => {
        subscribe.next(subscribe.value - 1);
      });
    });
    subscribe.subscribe((value) => {
      if (!value) {
        this.requestProcessed = false;
      }
    });
  }
}
