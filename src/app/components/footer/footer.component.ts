import { Component, Input } from '@angular/core';
import { Footer } from '../../_models/static-data/header';
import { PriceListGenerateService } from '../../_services/front/price-list-generate.service';

@Component({
  selector: 'flower-valley-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent {
  @Input()
  public footer: Footer | undefined;

  constructor(private pricesPDFService: PriceListGenerateService) {}

  public getPriceList(): void {
    this.pricesPDFService.generatePriceList();
  }
}
