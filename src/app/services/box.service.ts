import { Injectable } from '@angular/core';
import { Box } from '../_models/box';
import { Observable, Subject } from 'rxjs';

@Injectable()
export class BoxService {
  private _boxesUpdate: Subject<Box[]> = new Subject<Box[]>();

  public get boxes(): Box[] {
    return this._boxes;
  }

  private set boxes(value: Box[]) {
    this._boxes = value;
    this._boxesUpdate.next(value);
  }
  private _boxes: Box[] = [];

  public genBoxes(): void {
    this.boxes = [
      {
        id: 1,
        name: 'Коробка 25x10 см',
        price: 150,
        count: 12,
      },
      {
        id: 2,
        name: 'Коробка 23x13 см',
        price: 150,
        count: 5,
      },
    ];
  }

  public getBoxes(): Observable<Box[]> {
    return this._boxesUpdate.asObservable();
  }
}
