import { Injectable } from '@angular/core';
import { BaseApiService } from './base-api.service';
import { Observable } from 'rxjs';
import { Category } from '../../_models/category';

@Injectable({
  providedIn: 'root',
})
export class CatalogService extends BaseApiService {
  protected override apiUrl = 'category';

  public getItems(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.baseUrl}/${this.apiUrl}/list`);
  }
}
