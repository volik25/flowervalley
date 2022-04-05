import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StaticDataComponent } from './static-data.component';
import { MainComponent } from './main/main.component';
import { AboutComponent } from './components/about/about.component';
import { AdvantagesComponent } from './components/advantages/advantages.component';
import { HeaderAndFooterComponent } from './components/header-and-footer/header-and-footer.component';
import { ContactsComponent } from './components/contacts/contacts.component';
import { CartComponent } from './components/cart/cart.component';
import { OtherComponent } from './components/other/other.component';
import { AnimationComponent } from './components/animation/animation.component';
import { ProductComponent } from './components/product/product.component';

const routes: Routes = [
  {
    path: '',
    component: StaticDataComponent,
    children: [
      {
        path: '',
        component: MainComponent,
      },
      {
        path: 'header-and-footer',
        component: HeaderAndFooterComponent,
      },
      {
        path: 'animation',
        component: AnimationComponent,
      },
      {
        path: 'about',
        component: AboutComponent,
      },
      {
        path: 'advantages',
        component: AdvantagesComponent,
      },
      {
        path: 'product',
        component: ProductComponent,
      },
      {
        path: 'contacts',
        component: ContactsComponent,
      },
      {
        path: 'cart',
        component: CartComponent,
      },
      {
        path: 'other',
        component: OtherComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StaticDataRoutingModule {}
