import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MainPageRoutingModule } from './main-page-routing.module';
import { MainPageComponent } from './main-page.component';
import { BannerComponent } from './banner/banner.component';
import { ButtonModule } from 'primeng/button';
import { SharedModule } from 'primeng/api';
import { RippleModule } from 'primeng/ripple';
import { InputTextModule } from 'primeng/inputtext';
import { CarouselModule } from 'primeng/carousel';
import { FlowerValleySharedModule } from '../../components/shared.module';
import { SalesComponent } from './sales/sales.component';
import { AboutComponent } from './about/about.component';
import { AdvantagesComponent } from './advantages/advantages.component';

@NgModule({
  declarations: [
    MainPageComponent,
    BannerComponent,
    SalesComponent,
    AboutComponent,
    AdvantagesComponent,
  ],
  imports: [
    CommonModule,
    MainPageRoutingModule,
    ButtonModule,
    SharedModule,
    RippleModule,
    InputTextModule,
    CarouselModule,
    FlowerValleySharedModule,
  ],
})
export class MainPageModule {}
