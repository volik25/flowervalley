import { Injectable } from '@angular/core';
import { HtmlToPdfService } from './html-to-pdf.service';

@Injectable({
  providedIn: null,
})
export class EstimateGenerateService {
  constructor(private htmlToPdf: HtmlToPdfService) {}

  public getClientPDF(
    header: string[],
    content: any[],
    delivery: string,
    boxes: string,
    productsSum: string,
    sum: string,
  ): void {
    this.htmlToPdf.getPDF(true, header, content, delivery, boxes, productsSum, sum);
  }

  public getCompanyPDF(
    header: string[],
    content: any[],
    delivery: string,
    boxes: string,
    productsSum: string,
    sum: string,
    order: number,
    date: string | null,
  ): void {
    this.htmlToPdf.getPDF(
      false,
      header,
      content,
      delivery,
      boxes,
      productsSum,
      sum,
      order,
      date || undefined,
    );
  }
}
