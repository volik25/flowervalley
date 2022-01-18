import { ChangeDetectorRef, EventEmitter, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  /** отображать возможность отмены */
  private hasCancelBtn: boolean = true;
  /** срабатывает при отмене загрузки */
  public onCancel: EventEmitter<boolean> = new EventEmitter();
  /** cdRef */
  private cdRef!: ChangeDetectorRef;
  /** set isLoading */
  public set momentLoading(value: boolean) {
    // eslint-disable-next-line no-underscore-dangle
    this._momentLoading = value;
  }
  /** get isLoading */
  public get momentLoading(): boolean {
    // eslint-disable-next-line no-underscore-dangle
    return this._momentLoading;
  }
  public isLoading(): Observable<boolean> {
    return this._isLoading.asObservable();
  }
  /** идет загрузка */
  // @ts-ignore
  private _momentLoading: boolean;
  private _isLoading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  /** текущие подписки приложения */
  private subscriptions: Subscription = new Subscription();
  /** количество активных подписок */
  private subscriptionsCount: number = 0;
  /** установить отображение кнопки отмены по умолчанию */
  public setDefaultCancelBtn(): void {
    this.hasCancelBtn = true;
  }
  /** инициализация changeDetectorRef */
  public set changeDetectorRef(cdr: ChangeDetectorRef) {
    this.cdRef = cdr;
  }
  /** отменить текущие загрузки */
  public cancelLoading(): void {
    if (!this.hasCancelBtn) {
      return;
    }
    this.subscriptions.unsubscribe();
    this._isLoading.next(false);
    this.setDefaultCancelBtn();
    this.subscriptions = new Subscription();
    this.subscriptionsCount = 0;
  }
  /** добавление подписки */
  public addSubscription(subscription: Subscription): void {
    // eslint-disable-next-line no-plusplus
    this.subscriptionsCount++;
    this.subscriptions.add(subscription);
    this._isLoading.next(true);
    this.momentLoading = true;
    this.cdRef.detectChanges();
  }
  /** удаление подписки */
  public removeSubscription(subscription: Subscription): void {
    // eslint-disable-next-line no-plusplus
    this.subscriptionsCount--;
    this.subscriptions.remove(subscription);
    if (this.subscriptionsCount === 0) {
      this._isLoading.next(false);
      this.momentLoading = false;
      this.cdRef.detectChanges();
    }
  }
}
