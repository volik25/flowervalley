import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { DaDataEntity } from '../../_models/daDataEntity';

@Injectable({
  providedIn: 'root',
})
export class DadataService {
  private url: string = environment.dadataUrl;
  constructor(private http: HttpClient) {}

  public getFirmByINN(query: string): Observable<{ suggestions: DaDataEntity[] }> {
    return this.http.post<{ suggestions: DaDataEntity[] }>(this.url, { query: query });
  }
}
