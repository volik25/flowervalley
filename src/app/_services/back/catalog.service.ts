import { Injectable } from '@angular/core';
import { BaseApiService } from './base-api.service';
import { map, Observable } from 'rxjs';
import { Category } from '../../_models/category';
import { CategoryOrder } from '../../_models/category-order';
import { Step } from '../../_models/step';
import { ValidationErrors } from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class CatalogService extends BaseApiService {
  protected override apiUrl = 'category';

  public getItems(isDiscountRequest = false): Observable<Category[]> {
    if (!isDiscountRequest) {
      return this.http.get<Category[]>(`${this.baseUrl}/${this.apiUrl}/list`);
    } else {
      return this.http.get<Category[]>(`${this.baseUrl}/${this.apiUrl}/list`).pipe(
        map((categories) => {
          const discountCategories = categories.filter((item) => !item.parentId && !item.isTulip);
          discountCategories.map((item: any) => {
            delete item.isTulip;
            delete item.sale;
            delete item.parentId;
            item.isBlocked = Boolean(item.isBlocked);
          });
          return discountCategories;
        }),
      );
    }
  }

  public setCategoryOrder(order: CategoryOrder[]): Observable<any> {
    return this.http.post(`${this.baseUrl}/${this.apiUrl}/order`, order);
  }

  public setSteps(categoryId: number, step: { steps: Step[] }): Observable<any> {
    return this.http.post(`${this.baseUrl}/${this.apiUrl}/${categoryId}/steps`, step);
  }

  private isCategoryExists(name: string): Observable<any> {
    const encoded = encodeURI(name.toLocaleLowerCase());
    return this.http.get(`${this.baseUrl}/${this.apiUrl}/is-exists/${encoded}`);
  }

  public validateName(name: string): Observable<ValidationErrors | null> {
    /** Эмуляция запроса на сервер */
    return this.isCategoryExists(name).pipe(
      map((result) => {
        if (result) {
          return {
            nameError: 'Категория с таким названием уже существует',
          };
        }
        return null;
      }),
    );
  }
}
