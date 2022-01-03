import { Component, EventEmitter, Input, Output } from '@angular/core';
import { slugify } from 'transliteration';
import { Category } from '../../_models/category';
import { DialogService } from 'primeng/dynamicdialog';
import { EditCategoryComponent } from './edit-category/edit-category.component';
import { CatalogService } from '../../_services/back/catalog.service';
import { ConfirmationService } from 'primeng/api';

@Component({
  selector: 'flower-valley-catalog-item',
  templateUrl: './catalog-item.component.html',
  styleUrls: ['./catalog-item.component.scss'],
  providers: [DialogService],
})
export class CatalogItemComponent {
  @Input()
  public isAdmin: boolean = false;
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

  @Output()
  private categoryUpdated: EventEmitter<any> = new EventEmitter<any>();
  @Output()
  private categoryDeleted: EventEmitter<any> = new EventEmitter<any>();

  constructor(
    private ds: DialogService,
    private confirmationService: ConfirmationService,
    private catalogService: CatalogService,
  ) {}

  public showEditCategoryModal(): void {
    const modal = this.ds.open(EditCategoryComponent, {
      header: 'Редактировать категорию',
      width: '600px',
      data: {
        category: this.item,
      },
    });
    modal.onClose.subscribe((res: { success: boolean }) => {
      if (res?.success) this.categoryUpdated.emit();
    });
  }

  public deleteCategory(): void {
    this.confirmationService.confirm({
      header: 'Подтвердите удаление категории',
      message: `Вы действительно хотите удалить категорию ${this.item.name}?`,
      accept: () => {
        this.catalogService.deleteItem(this.item.id).subscribe(() => {
          this.categoryDeleted.emit();
        });
      },
    });
  }
}
