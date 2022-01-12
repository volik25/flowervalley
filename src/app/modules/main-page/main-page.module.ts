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
import { FlowerValleySharedModule } from '../../shared/shared.module';
import { SalesComponent } from './sales/sales.component';
import { AboutComponent } from './about/about.component';
import { AdvantagesComponent } from './advantages/advantages.component';
import { VideoComponent } from './video/video.component';
import { PipesModule } from '../../_pipes/pipes.module';
import { ReviewsComponent } from './reviews/reviews.component';
import { ClientsComponent } from './clients/clients.component';
import { AddVideoComponent } from './video/add-video/add-video.component';
import { ReactiveFormsModule } from '@angular/forms';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { EditVideoComponent } from './video/edit-video/edit-video.component';
import { AddReviewComponent } from './reviews/add-review/add-review.component';
import { EditReviewComponent } from './reviews/edit-review/edit-review.component';
import { AddClientComponent } from './clients/add-client/add-client.component';
import { EditClientComponent } from './clients/edit-client/edit-client.component';
import { GalleriaModule } from 'primeng/galleria';
import { EditBannerComponent } from './banner/edit-banner/edit-banner.component';
import { CheckboxModule } from 'primeng/checkbox';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';

@NgModule({
  declarations: [
    MainPageComponent,
    BannerComponent,
    SalesComponent,
    AboutComponent,
    AdvantagesComponent,
    VideoComponent,
    ReviewsComponent,
    ClientsComponent,
    AddVideoComponent,
    EditVideoComponent,
    AddReviewComponent,
    EditReviewComponent,
    AddClientComponent,
    EditClientComponent,
    EditBannerComponent,
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
    PipesModule,
    ReactiveFormsModule,
    InputTextareaModule,
    GalleriaModule,
    CheckboxModule,
    DropdownModule,
    InputNumberModule,
  ],
})
export class MainPageModule {}
