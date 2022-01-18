import { Injectable } from '@angular/core';
import { BaseApiService } from './base-api.service';
import { Observable } from 'rxjs';
import { Category } from '../../_models/category';
import { CategoryOrder } from '../../_models/category-order';
import { Step } from '../../_models/step';

@Injectable({
  providedIn: 'root',
})
export class CatalogService extends BaseApiService {
  protected override apiUrl = 'category';

  public getItems(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.baseUrl}/${this.apiUrl}/list`);
  }

  public setCategoryOrder(order: CategoryOrder[]): Observable<any> {
    return this.http.post(`${this.baseUrl}/${this.apiUrl}/order`, order);
  }

  public setSteps(categoryId: number, step: { steps: Step[] }): Observable<any> {
    return this.http.post(`${this.baseUrl}/${this.apiUrl}/${categoryId}/steps`, step);
  }
}
