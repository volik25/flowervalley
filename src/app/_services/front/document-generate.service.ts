import { Injectable } from '@angular/core';
import { EstimateGenerateService } from './estimate-generate.service';
import { OfferGenerateService } from './offer-generate.service';
import { Order } from '../../_models/order';
import { map, Observable } from 'rxjs';
import { Firm } from '../../_models/business-pack/firm';

@Injectable({
  providedIn: null,
})
export class DocumentGenerateService {
  constructor(
    private estimatePDF: EstimateGenerateService,
    private offerPDF: OfferGenerateService,
  ) {}

  public getOffer(order: Order, firm: Firm): Observable<File> {
    let client = '';
    client += firm.FullName;
    client += `, ${firm.Address}`;
    client += `, ИНН: ${firm.INN}`;
    client += `, КПП: ${firm.KPP}`;
    // @ts-ignore
    const orderNumber = order.id;
    // @ts-ignore
    const date = new Date(order.orderDate).toLocaleDateString() + 'г.';
    let sum: number = 0;
    // @ts-ignore
    const content: any[] = order.products.map((product) => {
      sum += product.count * product.price;
      return [
        product.product.name,
        'шт.',
        product.price,
        product.count,
        product.count * product.price,
      ];
    });
    this.offerPDF.getPDF(orderNumber, date, client, content, sum, false);
    return this.offerPDF.getGeneratedDocument().pipe(
      map((blob) => {
        return new File([blob], 'Коммерческое предложение.pdf');
      }),
    );
  }

  public getEstimate(order: Order, orderId: number): Observable<File> {
    let boxesSum = 0;
    let productsSum = 0;
    order.boxes.map((box) => {
      boxesSum += box.count * box.price;
    });
    return this.estimatePDF
      .getClientPDF(
        order.products.map((goods) => {
          productsSum += goods.price * goods.count;
          return [goods.product.name, goods.price, goods.count, goods.price * goods.count];
        }),
        order.deliveryPrice.toString(),
        boxesSum.toString(),
        productsSum.toString(),
        order.orderSum.toString(),
        orderId,
        false,
      )
      .pipe(
        map((blob) => {
          return new File([blob], `Смета по заказу №${orderId}.pdf`);
        }),
      );
  }
}
