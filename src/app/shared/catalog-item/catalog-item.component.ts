import { Component, Input } from '@angular/core';
import { slugify } from 'transliteration';
import { Category } from '../../_models/category';

@Component({
  selector: 'flower-valley-catalog-item',
  templateUrl: './catalog-item.component.html',
  styleUrls: ['./catalog-item.component.scss'],
})
export class CatalogItemComponent {
  private _item: any;
  @Input()
  public set item(value: Category) {
    this._item = value;
  }

  public get item(): Category {
    return this._item;
  }

  public get routerLink(): string {
    return slugify(this.item?.name || '');
  }
}
