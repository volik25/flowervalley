import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FeedBackService } from '../../../../_services/back/feed-back.service';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { isFormInvalid } from '../../../../_utils/formValidCheck';

@Component({
  selector: 'flower-valley-add-review',
  templateUrl: './add-review.component.html',
  styleUrls: ['./add-review.component.scss'],
})
export class AddReviewComponent {
  public reviewGroup: FormGroup;
  public isLoading: boolean = false;
  constructor(
    private fb: FormBuilder,
    private reviewService: FeedBackService,
    private ref: DynamicDialogRef,
  ) {
    this.reviewGroup = fb.group({
      src: [null],
      link: ['', Validators.required],
    });
  }

  public addReview(): void {
    if (isFormInvalid(this.reviewGroup)) return;
    this.isLoading = true;
    const review = this.reviewGroup.getRawValue();
    const formData = new FormData();
    formData.append('link', review.link);
    formData.append('img', review.src);
    this.reviewService.addItem<any>(formData).subscribe(() => {
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
