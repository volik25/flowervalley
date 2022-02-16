import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { StaticDataService } from '../../../../../_services/back/static-data.service';
import { isFormInvalid } from '../../../../../_utils/formValidCheck';

@Component({
  selector: 'flower-valley-other',
  templateUrl: './other.component.html',
  styleUrls: ['./other.component.scss'],
})
export class OtherComponent implements OnInit {
  public variablesForm: FormGroup;
  public isLoading: boolean = false;

  constructor(private fb: FormBuilder, private staticData: StaticDataService) {
    this.variablesForm = fb.group({
      minPrice: [null, Validators.required],
      cityDelivery: [null, Validators.required],
      deliveryPerKm: [null, Validators.required],
      mobileWhatsApp: ['', Validators.required],
      mobilePhone: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.staticData.getVariables().subscribe((data) => {
      this.variablesForm.patchValue(data);
    });
  }

  public saveOthers(): void {
    if (isFormInvalid(this.variablesForm)) return;
  }
}
