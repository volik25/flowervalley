import { Injectable } from '@angular/core';
import { HtmlToPdfService } from './html-to-pdf.service';

@Injectable({
  providedIn: null,
})
export class OfferGenerateService {
  constructor(private htmlToPdf: HtmlToPdfService) {}

  public getOfferPDF(
    header: string[],
    content: any[],
    delivery: string,
    boxes: string,
    productsSum: string,
    sum: string,
  ): void {
    this.htmlToPdf.getPDF(true, header, content, delivery, boxes, productsSum, sum);
  }
}
