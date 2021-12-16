import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { FlowerValleySharedModule } from './components/shared.module';
import { LoaderComponent } from './_loader/loader.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  declarations: [AppComponent, LoaderComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    RouterModule,
    ButtonModule,
    FlowerValleySharedModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
