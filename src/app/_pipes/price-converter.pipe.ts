import { Pipe, PipeTransform } from '@angular/core';
import { DecimalPipe } from '@angular/common';

@Pipe({
  name: 'priceConverter',
})
export class PriceConverterPipe implements PipeTransform {
  constructor(private decimalPipe: DecimalPipe) {}

  public transform(
    value: number | string,
    dotOptions?: 'none' | 'one' | 'two',
    curr?: 'RUB' | 'rub',
  ): string | null {
    return this.decimalTransform(value, dotOptions, curr);
  }

  private decimalTransform(
    value: number | string,
    dotOptions?: string,
    curr?: string,
  ): string | null {
    let number = this.decimalPipe.transform(value);
    number = number?.split(',').join(' ') || null;
    if (!number?.split('.')[1]) {
      switch (dotOptions) {
        case 'one':
          number += '.0';
          break;
        case 'two':
          number += '.00';
          break;
        default:
          break;
      }
    }
    if (curr === 'RUB') {
      return `${number}₽`;
    }
    if (curr === 'rub') {
      return `${number} руб`;
    }
    return `${number}₽`;
  }
}
