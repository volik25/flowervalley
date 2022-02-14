import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BoxesRoutingModule } from './boxes-routing.module';
import { BoxesComponent } from './boxes.component';
import { FlowerValleySharedModule } from '../../../shared/shared.module';
import { TableModule } from 'primeng/table';
import { FormsModule } from '@angular/forms';
import { InputNumberModule } from 'primeng/inputnumber';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';

@NgModule({
  declarations: [BoxesComponent],
  imports: [
    CommonModule,
    BoxesRoutingModule,
    FlowerValleySharedModule,
    TableModule,
    FormsModule,
    InputNumberModule,
    ButtonModule,
    InputTextModule,
  ],
})
export class BoxesModule {}
