import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Banner } from '../../../../../_models/banner';
import { BannerSettingsService } from '../../../../../_services/back/banner-settings.service';
import { isFormInvalid } from '../../../../../_utils/formValidCheck';
import { Router } from '@angular/router';

@Component({
  selector: 'flower-valley-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent {
  public settingsGroup: FormGroup;
  public settings?: Banner;
  public isLoading: boolean = false;
  constructor(
    private fb: FormBuilder,
    private bannerSettingsService: BannerSettingsService,
    private router: Router,
  ) {
    this.settingsGroup = fb.group({
      autoPlay: [null, Validators.required],
      isUserCanLeaf: [false, Validators.required],
    });
    const data = sessionStorage.getItem('saleSettings');
    if (data) this.settings = JSON.parse(data);
    if (this.settings) {
      this.settingsGroup.patchValue(this.settings);
    }
  }

  public saveSettings(): void {
    if (isFormInvalid(this.settingsGroup)) return;
    const settings = this.settingsGroup.getRawValue();
    this.bannerSettingsService.addItem(settings).subscribe(() => {
      sessionStorage.removeItem('saleSettings');
      this.router.navigate(['']);
    });
  }
}
