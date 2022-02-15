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

type ArrayTypes = 'workTime' | 'address' | 'phones' | 'mail';

@Component({
  selector: 'flower-valley-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.scss'],
})
export class ContactsComponent implements OnInit {
  public contactsForm: FormGroup;
  public isLoading: boolean = false;

  constructor(private fb: FormBuilder, private staticData: StaticDataService) {
    this.contactsForm = fb.group({
      workTime: fb.array([fb.control('', Validators.required)]),
      address: fb.array([fb.control('', Validators.required)]),
      whatsAppNumber: ['', Validators.required],
      phones: fb.array([fb.control('', Validators.required)]),
      mail: fb.array([fb.control('', Validators.required)]),
    });
  }

  ngOnInit(): void {
    this.staticData.getContactsContent().subscribe((data) => {
      this.contactsForm.patchValue(data);
    });
  }

  public saveContacts(): void {
    if (isFormInvalid(this.contactsForm)) return;
  }

  public getControlArray(control: ArrayTypes): FormArray {
    return this.contactsForm.controls[control] as FormArray;
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
