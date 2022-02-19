import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { isFormInvalid } from '../../../../../_utils/formValidCheck';
import { StaticDataService } from '../../../../../_services/back/static-data.service';

@Component({
  selector: 'flower-valley-static-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss'],
})
export class AboutComponent implements OnInit {
  public isLoading = false;
  public aboutForm: FormGroup;
  constructor(private fb: FormBuilder, private staticData: StaticDataService) {
    this.aboutForm = fb.group({
      img: ['', Validators.required],
      title: ['', Validators.required],
      subTitle: ['', Validators.required],
      description: ['', Validators.required],
    });
  }

  public ngOnInit(): void {
    this.staticData.getAboutContent().subscribe((data) => {
      this.aboutForm.patchValue(data);
    });
  }

  public saveAbout(): void {
    if (isFormInvalid(this.aboutForm)) return;
  }

  public photoUploaded(photos: File[]): void {
    this.aboutForm.get('img')?.setValue(photos[0]);
  }
}
