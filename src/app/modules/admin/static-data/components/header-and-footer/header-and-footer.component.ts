import { Component, OnInit } from '@angular/core';
import { StaticDataService } from '../../../../../_services/back/static-data.service';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { isFormInvalid } from '../../../../../_utils/formValidCheck';

type ArrayTypes = 'workTime' | 'address' | 'phones' | 'mail';

@Component({
  selector: 'flower-valley-header-and-footer',
  templateUrl: './header-and-footer.component.html',
  styleUrls: ['./header-and-footer.component.scss'],
})
export class HeaderAndFooterComponent implements OnInit {
  public headerForm: FormGroup;
  public isLoading: boolean = false;
  constructor(private fb: FormBuilder, private staticData: StaticDataService) {
    this.headerForm = fb.group({
      img: ['', Validators.required],
      title: ['', Validators.required],
      subTitle: ['', Validators.required],
      workTime: fb.array([fb.control('', Validators.required)]),
      address: fb.array([fb.control('', Validators.required)]),
      whatsAppNumber: ['', Validators.required],
      phones: fb.array([fb.control('', Validators.required)]),
      mail: fb.array([fb.control('', Validators.required)]),
    });
  }

  ngOnInit(): void {
    this.staticData.getHeaderContent().subscribe((data) => {
      this.headerForm.patchValue(data);
    });
  }

  public saveHeader(): void {
    if (isFormInvalid(this.headerForm)) return;
  }

  public photoUploaded(photos: File[]): void {
    this.headerForm.get('img')?.setValue(photos[0]);
  }

  public getControlArray(control: ArrayTypes): FormArray {
    return this.headerForm.controls[control] as FormArray;
  }

  public getFormControl(item: AbstractControl): FormControl {
    return item as FormControl;
  }

  public addControlToArray(formArray: ArrayTypes, values?: string[]): void {
    const control = this.fb.control('', Validators.required);
    if (values?.length) {
      values.map((value) => {
        control.patchValue(value);
      });
    }
    this.getControlArray(formArray).push(control);
  }

  public deleteArrayControl(formArray: ArrayTypes, index: number): void {
    this.getControlArray(formArray).removeAt(index);
  }

  public isFormArrayValid(formArray: ArrayTypes): boolean {
    return this.getControlArray(formArray).status === 'VALID';
  }
}
