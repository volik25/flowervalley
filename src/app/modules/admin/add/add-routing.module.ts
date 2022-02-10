import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddComponent } from './add.component';
import { ProductComponent } from './product/product.component';
import { CategoryComponent } from './category/category.component';
import { SalesComponent } from './sales/sales.component';
import { VideoComponent } from './video/video.component';
import { BoxComponent } from './box/box.component';

const routes: Routes = [
  { path: '', component: AddComponent },
  { path: 'product', component: ProductComponent },
  { path: 'category', component: CategoryComponent },
  { path: 'sale', component: SalesComponent },
  { path: 'video', component: VideoComponent },
  { path: 'box', component: BoxComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddRoutingModule {}
