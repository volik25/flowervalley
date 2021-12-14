import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { CatalogComponent } from './catalog/catalog.component';
import { ButtonModule } from 'primeng/button';
import { SharedModule } from 'primeng/api';
import { RouterModule } from '@angular/router';
import { ProductsComponent } from './products/products.component';
import { ContainerComponent } from './container/container.component';
import { LeafButtonComponent } from './leaf-button/leaf-button.component';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent,
    CatalogComponent,
    ProductsComponent,
    ContainerComponent,
    LeafButtonComponent,
  ],
  imports: [CommonModule, ButtonModule, SharedModule, RouterModule, InputTextModule, FormsModule],
  exports: [
    HeaderComponent,
    FooterComponent,
    CatalogComponent,
    ContainerComponent,
    ProductsComponent,
    LeafButtonComponent,
  ],
})
export class FlowerValleySharedModule {}
