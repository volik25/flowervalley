import { Injectable } from '@angular/core';
import { Box } from '../_models/box';

@Injectable()
export class BoxService {
  public genBoxes(): Box[] {
    return [
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
}
