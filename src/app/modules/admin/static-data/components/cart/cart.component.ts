import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { StaticDataService } from '../../../../../_services/back/static-data.service';
import { isFormInvalid } from '../../../../../_utils/formValidCheck';

type ArrayTypes = 'address' | 'phones' | 'mail';

@Component({
  selector: 'flower-valley-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
})
export class CartComponent implements OnInit {
  public cartForm: FormGroup;
  public isLoading: boolean = false;

  constructor(private fb: FormBuilder, private staticData: StaticDataService) {
    this.cartForm = fb.group({
      minSumTitle: ['', Validators.required],
      minSumInfo: ['', Validators.required],
      infoText: ['', Validators.required],
      address: fb.array([fb.control('', Validators.required)]),
      phones: fb.array([fb.control('', Validators.required)]),
      mail: fb.array([fb.control('', Validators.required)]),
      callText: ['', Validators.required],
      writeText: ['', Validators.required],
      bannerTitle: ['', Validators.required],
      leftBannerBlock: fb.group({
        title: ['', Validators.required],
        description: ['', Validators.required],
      }),
      centerBannerBlock: fb.group({
        title: ['', Validators.required],
        description: ['', Validators.required],
      }),
      rightBannerBlock: fb.group({
        title: ['', Validators.required],
        description: ['', Validators.required],
      }),
    });
  }

  ngOnInit(): void {
    this.staticData.getCartContent().subscribe((data) => {
      this.cartForm.patchValue(data);
    });
  }

  public saveCart(): void {
    if (isFormInvalid(this.cartForm)) return;
  }

  public getControlArray(control: ArrayTypes): FormArray {
    return this.cartForm.controls[control] as FormArray;
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
