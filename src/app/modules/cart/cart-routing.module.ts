import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CartComponent } from './cart.component';
import { DownloadInvoiceComponent } from './download-invoice/download-invoice.component';

const routes: Routes = [
  { path: '', component: CartComponent },
  {
    path: 'download-invoice',
    component: DownloadInvoiceComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CartRoutingModule {}
