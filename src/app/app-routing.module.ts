import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CatalogItemComponent } from './components/catalog-item/catalog-item.component';

const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./modules/main-page/main-page.module').then((m) => m.MainPageModule),
  },
  {
    path: 'catalog',
    component: CatalogItemComponent,
  },
  {
    path: 'catalog-item/:directory',
    component: CatalogItemComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'enabled' })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
