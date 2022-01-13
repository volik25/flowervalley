import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Banner } from '../../../../_models/banner';
import { isFormInvalid } from '../../../../_utils/formValidCheck';
import { BannerSettingsService } from '../../../../_services/back/banner-settings.service';

@Component({
  selector: 'flower-valley-sales-settings',
  templateUrl: './sales-settings.component.html',
  styleUrls: ['./sales-settings.component.scss'],
})
export class SalesSettingsComponent {
  public settingsGroup: FormGroup;
  public settings: Banner;
  public isLoading: boolean = false;
  constructor(
    private fb: FormBuilder,
    private config: DynamicDialogConfig,
    private ref: DynamicDialogRef,
    private bannerSettingsService: BannerSettingsService,
  ) {
    this.settingsGroup = fb.group({
      autoPlay: [null, Validators.required],
      isUserCanLeaf: [false, Validators.required],
    });
    this.settings = config.data?.settings;
    if (this.settings) {
      this.settingsGroup.patchValue(this.settings);
    }
  }

  public saveSettings(): void {
    if (isFormInvalid(this.settingsGroup)) return;
    const settings = this.settingsGroup.getRawValue();
    this.bannerSettingsService.addItem(settings).subscribe(() => {});
  }
}
