import { Injectable } from '@angular/core';
import { HtmlToPdfService } from './html-to-pdf.service';
import { Observable } from 'rxjs';
import { DocumentBox } from '../../_models/box';

@Injectable({
  providedIn: 'root',
})
export class EstimateGenerateService {
  private header: string[] = ['Товар', 'Цена ₽', 'Количество', 'Стоимость ₽'];
  constructor(private htmlToPdf: HtmlToPdfService) {}

  public getClientPDF(
    content: any[],
    delivery: string,
    boxes: DocumentBox[],
    productsSum: string,
    sum: string,
    orderId?: number,
    discount?: string,
    isOpened: boolean = true,
  ): Observable<Blob> {
    this.htmlToPdf.getPDF(
      true,
      this.header,
      content,
      delivery,
      boxes,
      productsSum,
      sum,
      orderId,
      undefined,
      discount || undefined,
      isOpened,
    );
    return this.htmlToPdf.getGeneratedDocument();
  }

  public getCompanyPDF(
    content: any[],
    delivery: string,
    boxes: DocumentBox[],
    productsSum: string,
    sum: string,
    order: number,
    date: string | null,
    discount: string | null,
    isOpened: boolean = true,
  ): Observable<Blob> {
    this.htmlToPdf.getPDF(
      false,
      this.header,
      content,
      delivery,
      boxes,
      productsSum,
      sum,
      order,
      date || undefined,
      discount || undefined,
      isOpened,
    );
    return this.htmlToPdf.getGeneratedDocument();
  }
}
