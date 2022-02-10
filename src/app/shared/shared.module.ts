import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CatalogItemComponent } from './catalog-item/catalog-item.component';
import { ButtonModule } from 'primeng/button';
import { SharedModule } from 'primeng/api';
import { RouterModule } from '@angular/router';
import { ProductItemComponent } from './product-item/product-item.component';
import { ContainerComponent } from './container/container.component';
import { LeafButtonComponent } from './leaf-button/leaf-button.component';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { SignInComponent } from './sign-in/sign-in.component';
import { PasswordModule } from 'primeng/password';
import { MenuModule } from 'primeng/menu';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { EditorModule } from 'primeng/editor';
import { FileUploadModule } from 'primeng/fileupload';
import { HttpClientModule } from '@angular/common/http';
import { ImageModule } from 'primeng/image';
import { FilesUploadComponent } from './files-upload/files-upload.component';
import { MultiSelectModule } from 'primeng/multiselect';
import { InputNumberModule } from 'primeng/inputnumber';
import { TableModule } from 'primeng/table';
import { SearchComponent } from './search/search.component';
import { CheckboxModule } from 'primeng/checkbox';
import { PipesModule } from '../_pipes/pipes.module';

@NgModule({
  declarations: [
    CatalogItemComponent,
    ProductItemComponent,
    ContainerComponent,
    LeafButtonComponent,
    SignInComponent,
    FilesUploadComponent,
    SearchComponent,
  ],
  imports: [
    CommonModule,
    ButtonModule,
    SharedModule,
    RouterModule,
    InputTextModule,
    FormsModule,
    ReactiveFormsModule,
    DropdownModule,
    PasswordModule,
    MenuModule,
    AutoCompleteModule,
    EditorModule,
    FileUploadModule,
    HttpClientModule,
    ImageModule,
    MultiSelectModule,
    InputNumberModule,
    TableModule,
    CheckboxModule,
    PipesModule,
  ],
  exports: [
    CatalogItemComponent,
    ContainerComponent,
    ProductItemComponent,
    LeafButtonComponent,
    SearchComponent,
    FilesUploadComponent,
  ],
})
export class FlowerValleySharedModule {}
