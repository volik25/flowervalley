import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CartRoutingModule } from './cart-routing.module';
import { CartComponent } from './cart.component';
import { FlowerValleySharedModule } from '../../shared/shared.module';
import { ImageModule } from 'primeng/image';
import { CartGoodsComponent } from './cart-goods/cart-goods.component';
import { TableModule } from 'primeng/table';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { PipesModule } from '../../_pipes/pipes.module';
import { ButtonModule } from 'primeng/button';
import { BoxService } from '../../_services/front/box.service';
import { OrderConfirmationComponent } from './order-confirmation/order-confirmation.component';
import { RippleModule } from 'primeng/ripple';
import { InputTextModule } from 'primeng/inputtext';
import { CheckboxModule } from 'primeng/checkbox';
import { DialogModule } from 'primeng/dialog';
import { ConfirmationGoodsComponent } from './confirmation-goods/confirmation-goods.component';

@NgModule({
  declarations: [
    CartComponent,
    CartGoodsComponent,
    OrderConfirmationComponent,
    ConfirmationGoodsComponent,
  ],
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
    RippleModule,
    InputTextModule,
    FormsModule,
    ReactiveFormsModule,
    CheckboxModule,
    DialogModule,
  ],
  providers: [BoxService],
})
export class CartModule {}
