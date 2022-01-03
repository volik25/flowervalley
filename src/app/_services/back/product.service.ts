import { Injectable } from '@angular/core';
import { BaseApiService } from './base-api.service';

@Injectable({
  providedIn: 'root',
})
export class ProductService extends BaseApiService {
  protected override apiUrl = 'product';
}
