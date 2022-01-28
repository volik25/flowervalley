import { Component, OnInit } from '@angular/core';
import { BreadcrumbService } from '../../../components/breadcrumb/breadcrumb.service';
import { Category } from '../../../_models/category';
import { LoadingService } from '../../../_services/front/loading.service';
import { CatalogService } from '../../../_services/back/catalog.service';

@Component({
  selector: 'flower-valley-seedlings',
  templateUrl: './seedlings.component.html',
  styleUrls: ['./seedlings.component.scss'],
})
export class SeedlingsComponent implements OnInit {
  public seedlingsCatalog: Category[] = [];
  constructor(
    private bs: BreadcrumbService,
    private ls: LoadingService,
    private catalogService: CatalogService,
  ) {
    bs.setItem('Рассада цветов');
  }

  public ngOnInit(): void {
    const sub = this.catalogService.getItems().subscribe((categories) => {
      this.seedlingsCatalog = categories
        .filter((item) => !item.parentId)
        .filter((item) => item.isSeedling)
        .sort((a, b) => a.categoryOrder - b.categoryOrder);
      this.ls.removeSubscription(sub);
    });
    this.ls.addSubscription(sub);
  }
}
