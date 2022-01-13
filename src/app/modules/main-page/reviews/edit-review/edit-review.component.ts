import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { isFormInvalid } from '../../../../_utils/formValidCheck';
import { FeedBackService } from '../../../../_services/back/feed-back.service';

@Component({
  selector: 'flower-valley-edit-review',
  templateUrl: './edit-review.component.html',
  styleUrls: ['./edit-review.component.scss'],
})
export class EditReviewComponent {
  public reviewGroup: FormGroup;
  public isLoading: boolean = false;
  private addedPhotos: File[] = [];
  private deleteIds: number[] = [];
  public currentPhotos: { id: number; src: string }[] = [];
  constructor(
    private fb: FormBuilder,
    private reviewService: FeedBackService,
    private ref: DynamicDialogRef,
    private config: DynamicDialogConfig,
  ) {
    this.reviewGroup = fb.group({
      autoPlay: [null, Validators.required],
      isUserCanLeaf: [false, Validators.required],
    });
    this.reviewGroup.patchValue(config.data.review);
    this.currentPhotos = config.data.review.photos;
  }

  public editReview(): void {
    if (isFormInvalid(this.reviewGroup)) return;
    this.isLoading = true;
    const review = this.reviewGroup.getRawValue();
    const formData = new FormData();
    this.addedPhotos.map((photo) => {
      formData.append('photos[]', photo);
    });
    this.deleteIds.map((id) => {
      formData.append('deleteIds[]', id.toString());
    });
    formData.append('autoPlay', review.autoPlay);
    formData.append('isUserCanLeaf', review.isUserCanLeaf);
    this.reviewService.addItem(formData).subscribe(() => {
      this.isLoading = false;
      this.ref.close({
        success: true,
      });
    });
  }

  public filesUploaded(photos: File[]) {
    this.addedPhotos = photos;
  }

  public removePhoto(id: number): void {
    this.deleteIds.push(id);
    const i = this.currentPhotos.findIndex((photo) => photo.id === id);
    this.currentPhotos.splice(i, 1);
  }
}
