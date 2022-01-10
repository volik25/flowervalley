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
import { BoxGenerateService } from '../../_services/front/box-generate.service';
import { OrderConfirmationComponent } from './order-confirmation/order-confirmation.component';
import { RippleModule } from 'primeng/ripple';
import { InputTextModule } from 'primeng/inputtext';
import { CheckboxModule } from 'primeng/checkbox';
import { DialogModule } from 'primeng/dialog';
import { ConfirmationGoodsComponent } from './confirmation-goods/confirmation-goods.component';
import { DownloadInvoiceComponent } from './download-invoice/download-invoice.component';
import { EntityFormComponent } from './order-confirmation/entity-form/entity-form.component';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { AccordionModule } from 'primeng/accordion';
import { TabViewModule } from 'primeng/tabview';
import { InputNumberModule } from 'primeng/inputnumber';
import { SplitButtonModule } from 'primeng/splitbutton';

@NgModule({
  declarations: [
    CartComponent,
    CartGoodsComponent,
    OrderConfirmationComponent,
    ConfirmationGoodsComponent,
    DownloadInvoiceComponent,
    EntityFormComponent,
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
    AutoCompleteModule,
    AccordionModule,
    TabViewModule,
    InputNumberModule,
    SplitButtonModule,
  ],
  providers: [BoxGenerateService],
})
export class CartModule {}
