import { Component, Input } from '@angular/core';

@Component({
  selector: 'flower-valley-catalog-item',
  templateUrl: './catalog-item.component.html',
  styleUrls: ['./catalog-item.component.scss'],
})
export class CatalogItemComponent {
  private _item: any;
  @Input()
  public set item(value) {
    this._item = value;
  }

  public get item() {
    return this._item;
  }
}
