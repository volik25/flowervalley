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
import { LoadingService } from '../../../../../_services/front/loading.service';
import { Contacts } from '../../../../../_models/static-data/contacts';
import { MessageService } from 'primeng/api';

type ArrayTypes = 'workTime' | 'address' | 'phones';

@Component({
  selector: 'flower-valley-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.scss'],
})
export class ContactsComponent implements OnInit {
  public contactsForm: FormGroup;
  public isLoading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private ls: LoadingService,
    private ms: MessageService,
    private staticData: StaticDataService,
  ) {
    this.contactsForm = fb.group({
      workTime: fb.array([fb.control('', Validators.required)]),
      address: fb.array([fb.control('', Validators.required)]),
      whatsAppNumber: ['', Validators.required],
      phones: fb.array([fb.control('', Validators.required)]),
      mail: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    const sub = this.staticData.getContactsContent().subscribe((data) => {
      this.patchValue(data);
      this.ls.removeSubscription(sub);
    });
    this.ls.addSubscription(sub);
  }

  public saveContacts(): void {
    if (isFormInvalid(this.contactsForm)) return;
    this.isLoading = true;
    this.contactsForm.disable();
    const contacts = this.contactsForm.getRawValue();
    this.staticData.setContactsContent(contacts).subscribe(() => {
      this.contactsForm.enable();
      this.isLoading = false;
      this.ms.add({
        severity: 'success',
        summary: 'Запрос выполнен',
        detail: 'Данные успешно обновлены',
      });
    });
  }

  private patchValue(contacts: Contacts): void {
    for (const key in contacts) {
      // @ts-ignore
      const value = contacts[key];
      if (value instanceof Array) {
        if (value.length > 1) {
          for (let i = 1; i < value.length; i++) {
            this.addControlToArray(key as ArrayTypes);
          }
        }
      }
    }
    this.contactsForm.patchValue(contacts);
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
