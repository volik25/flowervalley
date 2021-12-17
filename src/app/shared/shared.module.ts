import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CatalogItemComponent } from './catalog-item/catalog-item.component';
import { ButtonModule } from 'primeng/button';
import { SharedModule } from 'primeng/api';
import { RouterModule } from '@angular/router';
import { ProductItemComponent } from './product-item/product-item.component';
import { ContainerComponent } from './container/container.component';
import { LeafButtonComponent } from './leaf-button/leaf-button.component';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { BreadcrumbComponent } from './breadcrumb/breadcrumb.component';

@NgModule({
  declarations: [
    CatalogItemComponent,
    ProductItemComponent,
    ContainerComponent,
    LeafButtonComponent,
    BreadcrumbComponent,
  ],
  imports: [CommonModule, ButtonModule, SharedModule, RouterModule, InputTextModule, FormsModule],
  exports: [
    CatalogItemComponent,
    ContainerComponent,
    ProductItemComponent,
    LeafButtonComponent,
    BreadcrumbComponent,
  ],
})
export class FlowerValleySharedModule {}
