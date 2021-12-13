import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { CatalogComponent } from './catalog/catalog.component';
import { ButtonModule } from 'primeng/button';
import { SharedModule } from 'primeng/api';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [HeaderComponent, FooterComponent, CatalogComponent],
  imports: [CommonModule, ButtonModule, SharedModule, RouterModule],
  exports: [HeaderComponent, FooterComponent, CatalogComponent],
})
export class FlowerValleySharedModule {}
