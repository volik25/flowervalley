import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./modules/main-page/main-page.module').then((m) => m.MainPageModule),
  },
  {
    path: 'catalog',
    loadChildren: () => import('./modules/catalog/catalog.module').then((m) => m.CatalogModule),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'enabled' })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
