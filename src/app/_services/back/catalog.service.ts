import { Injectable } from '@angular/core';
import { BaseApiService } from './base-api.service';

@Injectable({
  providedIn: 'root',
})
export class CatalogService extends BaseApiService {
  protected override apiUrl = 'catalog';
}
