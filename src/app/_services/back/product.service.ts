import { Injectable } from '@angular/core';
import { BaseApiService } from './base-api.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProductService extends BaseApiService {
  protected override apiUrl = 'product';

  public search<T>(searchString: string): Observable<T> {
    return this.http.get<T>(
      `${this.baseUrl}/${this.apiUrl}/list?searchString=${encodeURI(searchString)}`,
    );
  }
}
