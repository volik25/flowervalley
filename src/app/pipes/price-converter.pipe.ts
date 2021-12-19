import { Pipe, PipeTransform } from '@angular/core';
import { DecimalPipe } from '@angular/common';

@Pipe({
  name: 'priceConverter',
})
export class PriceConverterPipe implements PipeTransform {
  constructor(private decimalPipe: DecimalPipe) {}

  public transform(value: number | string, dotOptions?: string): string | null {
    return this.decimalTransform(value, dotOptions);
  }

  private decimalTransform(value: number | string, dotOptions?: string): string | null {
    let number = this.decimalPipe.transform(value);
    number = number?.split(',').join(' ') || null;
    if (!number?.split('.')[1] && dotOptions) {
      number += '.0';
    }
    return `${number}₽`;
  }
}
