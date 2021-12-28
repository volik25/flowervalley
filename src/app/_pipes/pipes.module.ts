import { NgModule } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { SafeUrlPipe } from './safe-url.pipe';
import { PriceConverterPipe } from './price-converter.pipe';

@NgModule({
  declarations: [SafeUrlPipe, PriceConverterPipe],
  imports: [CommonModule],
  exports: [SafeUrlPipe, PriceConverterPipe],
  providers: [DecimalPipe],
})
export class PipesModule {}
