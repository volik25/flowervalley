import { Injectable } from '@angular/core';
import { BaseApiService } from './base-api.service';

@Injectable({
  providedIn: 'root',
})
export class SaleService extends BaseApiService {
  protected override apiUrl = 'sale';
}
