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
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { EditVideoComponent } from './video/edit-video/edit-video.component';
import { EditReviewComponent } from './reviews/edit-review/edit-review.component';
import { EditClientComponent } from './clients/edit-client/edit-client.component';
import { GalleriaModule } from 'primeng/galleria';
import { EditBannerComponent } from './banner/edit-banner/edit-banner.component';
import { CheckboxModule } from 'primeng/checkbox';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { SplitButtonModule } from 'primeng/splitbutton';
import { SalesSettingsComponent } from './sales/settings/sales-settings.component';
import { ImageModule } from 'primeng/image';
import { AddSaleComponent } from './sales/add-sale/add-sale.component';
import { EditSaleComponent } from './sales/edit-sale/edit-sale.component';
import { TooltipModule } from 'primeng/tooltip';
import { DialogModule } from 'primeng/dialog';
import { EditorModule } from 'primeng/editor';
import { SkeletonModule } from 'primeng/skeleton';

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
    EditReviewComponent,
    EditClientComponent,
    EditBannerComponent,
    SalesSettingsComponent,
    AddSaleComponent,
    EditSaleComponent,
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
    SplitButtonModule,
    ImageModule,
    TooltipModule,
    DialogModule,
    EditorModule,
    SkeletonModule,
    FormsModule,
  ],
})
export class MainPageModule {}
