import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StaticDataRoutingModule } from './static-data-routing.module';
import { StaticDataComponent } from './static-data.component';

@NgModule({
  declarations: [StaticDataComponent],
  imports: [CommonModule, StaticDataRoutingModule],
})
export class StaticDataModule {}
