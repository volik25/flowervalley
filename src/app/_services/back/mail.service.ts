import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Order } from '../../_models/order';

@Injectable({
  providedIn: 'root',
})
export class MailService {
  private baseUrl = environment.baseUrl;

  private apiUrl: string = 'mails';

  constructor(private http: HttpClient) {}

  public sendIndividualMail(data: FormData, order: Order): Observable<any> {
    this.sendCopyToAdmin(false, order);
    return this.http.post(`${this.baseUrl}/${this.apiUrl}/individual`, data);
  }

  public sendBusinessMail(data: FormData, order: Order, firmName: string): Observable<any> {
    this.sendCopyToAdmin(true, order, firmName);
    return this.http.post(`${this.baseUrl}/${this.apiUrl}/business`, data);
  }

  public sendBusinessRequestMail(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/${this.apiUrl}/business-request`, data);
  }

  public sendEditOrderMail(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/${this.apiUrl}/edit-order`, data);
  }

  private sendAdminMail(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/${this.apiUrl}/admin`, data);
  }

  public sendPricesMail(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/${this.apiUrl}/price-list`, data);
  }

  private sendCopyToAdmin(isBusiness: boolean, order: Order, firmName?: string): void {
    const data = new FormData();
    data.append('isBusiness', `${isBusiness}`);
    data.append('sum', order.orderSum.toString());
    data.append('orderId', order.id.toString());
    data.append('clientName', firmName || order.clientName);
    data.append('email', 'i.a.volik@gmail.com');
    this.sendAdminMail(data).subscribe();
  }
}
