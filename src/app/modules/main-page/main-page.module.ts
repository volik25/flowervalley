import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MainPageRoutingModule } from './main-page-routing.module';
import { MainPageComponent } from './main-page.component';
import { MainBannerComponent } from './main-banner/main-banner.component';
import { ButtonModule } from 'primeng/button';
import { SharedModule } from 'primeng/api';
import { RippleModule } from 'primeng/ripple';

@NgModule({
  declarations: [MainPageComponent, MainBannerComponent],
  imports: [CommonModule, MainPageRoutingModule, ButtonModule, SharedModule, RippleModule],
})
export class MainPageModule {}
