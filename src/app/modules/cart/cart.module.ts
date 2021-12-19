import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CartRoutingModule } from './cart-routing.module';
import { CartComponent } from './cart.component';
import { FlowerValleySharedModule } from '../../shared/shared.module';

@NgModule({
  declarations: [CartComponent],
  imports: [CommonModule, CartRoutingModule, FlowerValleySharedModule],
})
export class CartModule {}
