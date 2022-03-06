import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminGuard } from './_guards/admin.guard';
import { SignInComponent } from './components/sign-in/sign-in.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
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
    canActivate: [AdminGuard],
  },
  {
    path: 'sign-in',
    component: SignInComponent,
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
