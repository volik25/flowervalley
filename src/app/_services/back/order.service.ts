import { Injectable } from '@angular/core';
import { BaseApiService } from './base-api.service';
import { Observable } from 'rxjs';
import { Box } from '../../_models/box';

@Injectable({
  providedIn: 'root',
})
export class OrderService extends BaseApiService {
  protected override apiUrl = 'order';

  public getItems(): Observable<Box[]> {
    return this.http.get<Box[]>(`${this.baseUrl}/${this.apiUrl}/list`);
  }
}
