import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Firm } from '../../_models/business-pack/firm';
import { environment } from '../../../environments/environment';
import { GoodsBusinessPack } from '../../_models/business-pack/goods-base';
import { Invoice } from '../../_models/business-pack/invoice';

@Injectable()
export class BusinessPackService {
  private _selfId = '00~Pvjh00003';
  private _telepakId = '';
  private baseId = environment.bpId;
  private baseUrl = `${environment.bpUrl}/${this.baseId}`;

  public get selfId(): string {
    return this._selfId;
  }

  public get telepakId(): string {
    return this._telepakId;
  }

  public set telepakId(value: string) {
    this._telepakId = value;
  }

  constructor(private http: HttpClient) {}

  //------------------------ API Фирм -----------------------------//

  public searchFirm(query?: string): Observable<{ items: Firm[]; total_count: number }> {
    return this.http.get<{ items: Firm[]; total_count: number }>(
      `${this.baseUrl}/firm/search${query ? `?query=${encodeURIComponent(query)}` : `?query=test`}`,
    );
  }

  public createFirm(firm: Firm): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/firm`, firm);
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
    return this.http.post(`${this.baseUrl}/firm/${Object}`, firm);
  }

  //------------------------ API Счетов -----------------------------//

  public createInvoice(invoice: Invoice): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/doc-invoice`, invoice);
  }

  public getInvoiceById(id: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/doc-invoice/${id}`);
  }

  public deleteInvoice(id: string): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/doc-invoice/${id}`);
  }

  public sendInvoiceToTelepak(
    id: string,
    params: { report_name: string; send_with_stamp: boolean },
  ): Observable<{ id: string }> {
    return this.http.post<{ id: string }>(`${this.baseUrl}/doc-invoice/${id}/send-telepak`, params);
  }

  //------------------------ API Товаров -----------------------------//

  public searchGoods(query?: string): Observable<any> {
    return this.http.get<GoodsBusinessPack[]>(
      `${this.baseUrl}/model/search${query ? `?query=${encodeURIComponent(query)}` : ``}`,
    );
  }

  public createGoods(goods: GoodsBusinessPack): Observable<{ Object: string }> {
    return this.http.post<{ Object: string }>(`${this.baseUrl}/model`, goods);
  }

  public getGoodsById(id: string): Observable<GoodsBusinessPack> {
    return this.http.get<GoodsBusinessPack>(`${this.baseUrl}/model/${id}`);
  }

  public deleteGoods(id: string): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/model/${id}`);
  }

  public updateGoods(goods: GoodsBusinessPack): Observable<{ Object: string }> {
    const { Object } = goods;
    delete goods.Object;
    return this.http.post<{ Object: string }>(`${this.baseUrl}/model/${Object}`, goods);
  }

  public searchVolume(query?: string): Observable<any> {
    return this.http.get<any>(
      `${this.baseUrl}/volume/search${query ? `?query=${encodeURIComponent(query)}` : ``}`,
    );
  }
}
