import { Injectable } from '@angular/core';
import { BaseApiService } from './base-api.service';
import { Observable } from 'rxjs';
import { Order } from '../../_models/order';

@Injectable({
  providedIn: 'root',
})
export class OrderService extends BaseApiService {
  protected override apiUrl = 'order';

  public getItems(skip: number, take: number): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.baseUrl}/${this.apiUrl}/list?skip=${skip}&take=${take}`);
  }
}
