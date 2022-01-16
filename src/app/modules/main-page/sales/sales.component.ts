import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MainBanner } from '../../../_models/main-banner';
import { Sale } from '../../../_models/sale';
import { DialogService } from 'primeng/dynamicdialog';
import { EditSaleComponent } from './edit-sale/edit-sale.component';
import { Router } from '@angular/router';
import { slugify } from 'transliteration';
import { SaleService } from '../../../_services/back/sale.service';
import { ConfirmationService } from 'primeng/api';

@Component({
  selector: 'flower-valley-sales',
  templateUrl: './sales.component.html',
  styleUrls: ['./sales.component.scss'],
  providers: [DialogService],
})
export class SalesComponent {
  @Input()
  public sales!: MainBanner<Sale[]>;
  @Input()
  public isAdmin: boolean = false;
  @Output()
  public saleEdited: EventEmitter<any> = new EventEmitter<any>();

  constructor(
    private ds: DialogService,
    private router: Router,
    private saleService: SaleService,
    private cs: ConfirmationService,
  ) {}

  public showEditSaleModal(sale: Sale): void {
    const modal = this.ds.open(EditSaleComponent, {
      width: '600px',
      header: 'Редактировать акцию',
      data: {
        sale: { ...sale, categoryId: Number(sale.categoryId) },
      },
    });
    modal.onClose.subscribe((res: { success: boolean }) => {
      if (res && res.success) this.saleEdited.emit();
    });
  }

  public deleteSale(id: number): void {
    this.cs.confirm({
      header: 'Подтвердите удаление акции',
      message: 'Вы действительно хотите удалить акцию?',
      accept: () => {
        this.saleService.deleteItem(id).subscribe(() => {
          if (this.sales.items && this.sales.items.length) {
            const index = this.sales.items?.findIndex((item) => item.id === id);
            this.sales.items.splice(index, 1);
          }
        });
      },
    });
  }

  public navigateTo(categoryName: string): void {
    this.router.navigate(['catalog', slugify(categoryName)]);
  }
}
