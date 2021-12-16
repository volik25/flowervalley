import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CatalogRoutingModule } from './catalog-routing.module';
import { CatalogComponent } from './catalog.component';
import { FlowerValleySharedModule } from '../../components/shared.module';
import { CategoryComponent } from './category/category.component';
import { ProductComponent } from './product/product.component';
import { CarouselModule } from 'primeng/carousel';
import { ImageModule } from 'primeng/image';
import { GalleriaModule } from 'primeng/galleria';

@NgModule({
  declarations: [CatalogComponent, CategoryComponent, ProductComponent],
  imports: [
    CommonModule,
    CatalogRoutingModule,
    FlowerValleySharedModule,
    CarouselModule,
    ImageModule,
    GalleriaModule,
  ],
})
export class CatalogModule {}
