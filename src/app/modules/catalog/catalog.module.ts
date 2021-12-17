import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CatalogRoutingModule } from './catalog-routing.module';
import { CatalogComponent } from './catalog.component';
import { FlowerValleySharedModule } from '../../shared/shared.module';
import { CategoryComponent } from './category/category.component';
import { ProductComponent } from './product/product.component';
import { CarouselModule } from 'primeng/carousel';
import { ImageModule } from 'primeng/image';
import { GalleriaModule } from 'primeng/galleria';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { PipesModule } from '../../pipes/pipes.module';

@NgModule({
  declarations: [CatalogComponent, CategoryComponent, ProductComponent],
  imports: [
    CommonModule,
    CatalogRoutingModule,
    FlowerValleySharedModule,
    CarouselModule,
    ImageModule,
    GalleriaModule,
    FormsModule,
    ButtonModule,
    PipesModule,
  ],
})
export class CatalogModule {}