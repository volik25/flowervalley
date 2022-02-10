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
  {
    path: 'private-policy',
    loadChildren: () =>
      import('./modules/private-policy/private-policy.module').then((m) => m.PrivatePolicyModule),
  },
  {
    path: 'contacts',
    loadChildren: () => import('./modules/contacts/contacts.module').then((m) => m.ContactsModule),
  },
  {
    path: 'cart',
    loadChildren: () => import('./modules/cart/cart.module').then((m) => m.CartModule),
  },
  {
    path: 'admin',
    loadChildren: () => import('./modules/admin/admin.module').then((m) => m.AdminModule),
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      scrollPositionRestoration: 'enabled',
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
