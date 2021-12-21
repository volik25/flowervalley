import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Goods } from '../_models/business-pack/goods';
import { Firm } from '../_models/business-pack/firm';
import { environment } from '../../environments/environment';

@Injectable()
export class BusinessPackService {
  private baseId = environment.baseId;

  private baseUrl = `bpApi/${this.baseId}`;

  constructor(private http: HttpClient) {}

  //------------------------ API Фирм -----------------------------//

  public searchFirm(query?: string): Observable<Firm[]> {
    return this.http.get<Firm[]>(
      `${this.baseUrl}/firm/search${query ? `?query=${encodeURIComponent(query)}` : `?query=test`}`,
    );
  }

  public createFirm(firm: Firm): Observable<string> {
    return this.http.post<string>(`${this.baseUrl}/firm`, firm);
  }

  public getFirmById(id: string): Observable<Firm> {
    return this.http.get<Firm>(`${this.baseUrl}/firm/${id}`);
  }

  public deleteFirm(id: string): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/firm/${id}`);
  }

  public updateFirm(firm: Firm): Observable<any> {
    const { Object } = firm;
    delete firm.Object;
    return this.http.post(`${this.baseUrl}/model/${Object}`, firm);
  }

  //------------------------ API Счетов -----------------------------//

  public createInvoice(invoice: any): Observable<string> {
    return this.http.post<string>(`${this.baseUrl}/doc-invoice`, invoice);
  }

  public getInvoiceById(id: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/doc-invoice/${id}`);
  }

  public deleteInvoice(id: string): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/doc-invoice/${id}`);
  }

  public sendInvoiceToTelepak(id: string, params: any): Observable<string> {
    return this.http.post<string>(`${this.baseUrl}/doc-invoice/${id}/send-telepak`, params);
  }

  //------------------------ API Товаров -----------------------------//

  public searchGoods(query?: string): Observable<Goods[]> {
    return this.http.get<Goods[]>(
      `${this.baseUrl}/model/search${query ? `?query=${encodeURIComponent(query)}` : ``}`,
    );
  }

  public createGoods(goods: Goods): Observable<string> {
    return this.http.post<string>(`${this.baseUrl}/model`, goods);
  }

  public getGoodsById(id: string): Observable<Goods> {
    return this.http.get<Goods>(`${this.baseUrl}/model/${id}`);
  }

  public deleteGoods(id: string): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/model/${id}`);
  }

  public updateGoods(goods: Goods): Observable<any> {
    const { object } = goods;
    delete goods.object;
    return this.http.post(`${this.baseUrl}/model/${object}`, goods);
  }
}
