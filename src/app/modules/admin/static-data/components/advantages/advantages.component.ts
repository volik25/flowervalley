import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { StaticDataService } from '../../../../../_services/back/static-data.service';
import { isFormInvalid } from '../../../../../_utils/formValidCheck';

interface Photos {
  left: string;
  center: string;
  right: string;
}

@Component({
  selector: 'flower-valley-advantages',
  templateUrl: './advantages.component.html',
  styleUrls: ['./advantages.component.scss'],
})
export class AdvantagesComponent implements OnInit {
  public advantagesForm: FormGroup;
  public photos: Photos | undefined;
  public isLoading: boolean = false;
  constructor(private fb: FormBuilder, private staticData: StaticDataService) {
    this.advantagesForm = fb.group({
      title: ['', Validators.required],
      subTitle: ['', Validators.required],
      leftBlock: fb.group({
        img: ['', Validators.required],
        title: ['', Validators.required],
        description: ['', Validators.required],
      }),
      centerBlock: fb.group({
        img: ['', Validators.required],
        title: ['', Validators.required],
        description: ['', Validators.required],
      }),
      rightBlock: fb.group({
        img: ['', Validators.required],
        title: ['', Validators.required],
        description: ['', Validators.required],
      }),
    });
  }

  public ngOnInit(): void {
    this.staticData.getAdvantagesContent().subscribe((data) => {
      this.advantagesForm.patchValue(data);
      this.photos = {
        left: data.leftBlock.img,
        center: data.centerBlock.img,
        right: data.rightBlock.img,
      };
    });
  }

  public saveAdvantages(): void {
    if (isFormInvalid(this.advantagesForm)) return;
  }

  public photoUploaded(photos: File[], path: 'leftBlock' | 'centerBlock' | 'rightBlock'): void {
    this.advantagesForm.get(path)?.get('img')?.setValue(photos[0]);
  }
}
