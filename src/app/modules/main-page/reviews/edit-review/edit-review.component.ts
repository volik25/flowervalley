import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { isFormInvalid } from '../../../../_utils/formValidCheck';
import { FeedBackService } from '../../../../_services/back/feed-back.service';
import { Feedback } from '../../../../_models/feedback';

@Component({
  selector: 'flower-valley-edit-review',
  templateUrl: './edit-review.component.html',
  styleUrls: ['../add-review/add-review.component.scss'],
})
export class EditReviewComponent {
  public reviewGroup: FormGroup;
  public isLoading: boolean = false;
  constructor(
    private fb: FormBuilder,
    private reviewService: FeedBackService,
    private ref: DynamicDialogRef,
    private config: DynamicDialogConfig,
  ) {
    this.reviewGroup = fb.group({
      id: [''],
      src: [''],
      link: ['', Validators.required],
    });
    this.reviewGroup.patchValue(config.data.review);
  }

  public editReview(): void {
    if (isFormInvalid(this.reviewGroup)) return;
    this.isLoading = true;
    const review = this.reviewGroup.getRawValue();
    this.reviewService.updateItem<Feedback>(review).subscribe(() => {
      this.isLoading = false;
      this.ref.close({
        success: true,
      });
    });
  }

  public filesUploaded(photos: File[]) {
    this.reviewGroup.get('src')?.setValue(photos[0]);
  }
}
