import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MainBannerService {
  protected baseUrl = environment.baseUrl;

  protected apiUrl: string = 'main';

  constructor(protected http: HttpClient) {}

  public updateItem<T>(item: T): Observable<any> {
    return this.http.post<string>(`${this.baseUrl}/${this.apiUrl}`, item);
  }
}
