import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './admin.component';

const routes: Routes = [
  { path: '', component: AdminComponent },
  { path: 'add', loadChildren: () => import('./add/add.module').then((m) => m.AddModule) },
  { path: 'edit', loadChildren: () => import('./edit/edit.module').then((m) => m.EditModule) },
  { path: 'boxes', loadChildren: () => import('./boxes/boxes.module').then((m) => m.BoxesModule) },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
