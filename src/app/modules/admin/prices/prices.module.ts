import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PricesRoutingModule } from './prices-routing.module';
import { PricesComponent } from './prices.component';
import { TableModule } from 'primeng/table';
import { PipesModule } from '../../../_pipes/pipes.module';
import { InputNumberModule } from 'primeng/inputnumber';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { FlowerValleySharedModule } from '../../../shared/shared.module';
import { SplitButtonModule } from 'primeng/splitbutton';
import { IndividualComponent } from './individual/individual.component';
import { MultiSelectModule } from 'primeng/multiselect';

@NgModule({
  declarations: [PricesComponent, IndividualComponent],
  imports: [
    CommonModule,
    PricesRoutingModule,
    TableModule,
    PipesModule,
    InputNumberModule,
    FormsModule,
    InputTextModule,
    ButtonModule,
    FlowerValleySharedModule,
    SplitButtonModule,
    MultiSelectModule,
    ReactiveFormsModule,
  ],
})
export class PricesModule {}
