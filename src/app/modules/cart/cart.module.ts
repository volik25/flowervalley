import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CartRoutingModule } from './cart-routing.module';
import { CartComponent } from './cart.component';
import { FlowerValleySharedModule } from '../../shared/shared.module';
import { ImageModule } from 'primeng/image';
import { CartGoodsComponent } from './cart-goods/cart-goods.component';
import { TableModule } from 'primeng/table';
import { FormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { PipesModule } from '../../pipes/pipes.module';
import { ButtonModule } from 'primeng/button';
import { BoxService } from '../../services/box.service';

@NgModule({
  declarations: [CartComponent, CartGoodsComponent],
  imports: [
    CommonModule,
    CartRoutingModule,
    FlowerValleySharedModule,
    ImageModule,
    TableModule,
    FormsModule,
    CardModule,
    PipesModule,
    ButtonModule,
  ],
  providers: [BoxService],
})
export class CartModule {}
