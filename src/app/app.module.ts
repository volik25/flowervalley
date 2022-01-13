import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { FlowerValleySharedModule } from './shared/shared.module';
import { LoaderComponent } from './components/loader/loader.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { ImageModule } from 'primeng/image';
import { DialogModule } from 'primeng/dialog';
import { BreadcrumbService } from './components/breadcrumb/breadcrumb.service';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { CartModalComponent } from './components/cart-modal/cart-modal.component';
import { PipesModule } from './_pipes/pipes.module';
import { FormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { BpRequestInterceptor } from './_interceptors/bp-request.interceptor';
import { BusinessPackService } from './_services/back/business-paсk.service';
import { TokenInterceptor } from './_interceptors/token.interceptor';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { BreadcrumbComponent } from './components/breadcrumb/breadcrumb.component';
import { DadataInterceptor } from './_interceptors/dadata.interceptor';

@NgModule({
  declarations: [
    AppComponent,
    LoaderComponent,
    HeaderComponent,
    FooterComponent,
    CartModalComponent,
    BreadcrumbComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    RouterModule,
    ButtonModule,
    FlowerValleySharedModule,
    ImageModule,
    DialogModule,
    OverlayPanelModule,
    PipesModule,
    FormsModule,
    HttpClientModule,
    ConfirmDialogModule,
    ToastModule,
    InputTextModule,
    InputNumberModule,
  ],
  providers: [
    BreadcrumbService,
    BusinessPackService,
    ConfirmationService,
    MessageService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: BpRequestInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: DadataInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
