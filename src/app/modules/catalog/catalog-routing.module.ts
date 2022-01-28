import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CatalogComponent } from './catalog.component';
import { CategoryComponent } from './category/category.component';
import { ProductComponent } from './product/product.component';
import { SeedlingsComponent } from './seedlings/seedlings.component';

const routes: Routes = [
  {
    path: '',
    component: CatalogComponent,
  },
  { path: 'seedlings', component: SeedlingsComponent },
  { path: ':category', component: CategoryComponent },
  { path: ':category/:id', component: ProductComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CatalogRoutingModule {}
