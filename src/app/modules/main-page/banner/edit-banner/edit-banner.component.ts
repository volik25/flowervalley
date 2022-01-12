import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { isFormInvalid } from '../../../../_utils/formValidCheck';
import { MainBannerService } from '../../../../_services/back/main-banner.service';
import { CatalogService } from '../../../../_services/back/catalog.service';
import { Category } from '../../../../_models/category';
import { MainBanner } from '../../../../_models/main-banner';
import { slugify } from 'transliteration';

@Component({
  selector: 'flower-valley-edit-banner',
  templateUrl: './edit-banner.component.html',
  styleUrls: ['./edit-banner.component.scss'],
})
export class EditBannerComponent implements OnInit {
  public bannerGroup: FormGroup;
  public catalog: Category[] = [];
  public isLoading: boolean = false;
  public photos: File[] = [];
  public photosLinks: string[] = [];
  constructor(
    private fb: FormBuilder,
    private mainBannerService: MainBannerService,
    private catalogService: CatalogService,
    private ref: DynamicDialogRef,
    private config: DynamicDialogConfig,
  ) {
    this.bannerGroup = fb.group({
      id: [''],
      title: ['', Validators.required],
      description: ['', Validators.required],
      label: ['', Validators.required],
      routerLink: ['', Validators.required],
      autoPlay: ['', Validators.required],
      isUserCanLeaf: [false, Validators.required],
    });
  }

  public ngOnInit(): void {
    this.catalogService.getItems().subscribe((catalog) => {
      this.catalog = catalog;
      const banner: MainBanner = this.config.data.banner;
      this.photosLinks = banner.photos || [];
      this.bannerGroup.patchValue(banner);
      const link = catalog.find((category) => slugify(category.name) === banner.routerLink);
      this.bannerGroup.get('routerLink')?.setValue(link?.name);
      this.bannerGroup.get('autoPlay')?.setValue(banner.autoPlay / 1000);
    });
  }

  public editBanner(): void {
    if (isFormInvalid(this.bannerGroup)) return;
    this.isLoading = true;
    const banner = this.bannerGroup.getRawValue();
    const formData = new FormData();
    Object.getOwnPropertyNames(banner).map((key) => {
      // @ts-ignore
      let value = banner[key];
      if (key === 'routerLink') {
        value = slugify(banner[key]);
      }
      if (key === 'autoPlay') {
        value = value * 1000;
      }
      formData.append(key, value);
    });
    if (this.photos.length) {
      this.photos.map((photo) => formData.append('photos[]', photo));
    }
    this.mainBannerService.updateItem(formData).subscribe(() => {
      this.isLoading = false;
      this.ref.close({
        success: true,
      });
    });
  }

  public uploadFiles(files: File[]): void {
    this.photos = files;
  }
}
