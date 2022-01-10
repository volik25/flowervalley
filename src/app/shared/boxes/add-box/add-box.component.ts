import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BoxService } from '../../../_services/back/box.service';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { isFormInvalid } from '../../../_utils/formValidCheck';
import { Box } from '../../../_models/box';

@Component({
  selector: 'flower-valley-add-box',
  templateUrl: './add-box.component.html',
  styleUrls: ['./add-box.component.scss'],
})
export class AddBoxComponent {
  public boxesForm: FormGroup;
  public isLoading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private boxService: BoxService,
    private ref: DynamicDialogRef,
  ) {
    this.boxesForm = fb.group({
      name: ['', Validators.required],
      volume: [null, Validators.required],
      price: [null, Validators.required],
    });
  }

  public saveBox(): void {
    if (isFormInvalid(this.boxesForm)) return;
    const box = this.boxesForm.getRawValue();
    this.isLoading = true;
    this.boxesForm.disable();
    this.boxService.addItem<Box>(box).subscribe(() => {
      this.isLoading = false;
      this.ref.close({ success: true });
    });
  }
}
