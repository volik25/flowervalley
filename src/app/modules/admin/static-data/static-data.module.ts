import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StaticDataRoutingModule } from './static-data-routing.module';
import { StaticDataComponent } from './static-data.component';
import { MenuComponent } from './menu/menu.component';
import { FlowerValleySharedModule } from '../../../shared/shared.module';
import { AboutComponent } from './components/about/about.component';
import { MainComponent } from './main/main.component';
import { MenuModule } from 'primeng/menu';
import { AdvantagesComponent } from './components/advantages/advantages.component';
import { CardModule } from 'primeng/card';
import { HeaderAndFooterComponent } from './components/header-and-footer/header-and-footer.component';
import { ContactsComponent } from './components/contacts/contacts.component';
import { CartComponent } from './components/cart/cart.component';
import { OtherComponent } from './components/other/other.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { EditorModule } from 'primeng/editor';
import { ImageModule } from 'primeng/image';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputMaskModule } from 'primeng/inputmask';
import { MainPageModule } from '../../main-page/main-page.module';
import { AnimationComponent } from './components/animation/animation.component';
import { ProductComponent } from './components/product/product.component';
import { CatalogModule } from '../../catalog/catalog.module';
import { PrivatePolicyComponent } from './components/private-policy/private-policy.component';
import { MainMenuComponent } from './components/main-menu/main-menu.component';
import { TableModule } from 'primeng/table';
import { AutoCompleteModule } from 'primeng/autocomplete';

@NgModule({
  declarations: [
    StaticDataComponent,
    MenuComponent,
    AboutComponent,
    MainComponent,
    AdvantagesComponent,
    HeaderAndFooterComponent,
    ContactsComponent,
    CartComponent,
    OtherComponent,
    AnimationComponent,
    ProductComponent,
    PrivatePolicyComponent,
    MainMenuComponent,
  ],
  imports: [
    CommonModule,
    StaticDataRoutingModule,
    FlowerValleySharedModule,
    MenuModule,
    CardModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    EditorModule,
    ImageModule,
    InputTextareaModule,
    InputNumberModule,
    InputMaskModule,
    MainPageModule,
    CatalogModule,
    TableModule,
    FormsModule,
    AutoCompleteModule,
  ],
})
export class StaticDataModule {}
