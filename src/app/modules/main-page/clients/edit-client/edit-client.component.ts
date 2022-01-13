import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { isFormInvalid } from '../../../../_utils/formValidCheck';
import { ClientService } from '../../../../_services/back/client.service';

@Component({
  selector: 'flower-valley-edit-client',
  templateUrl: './edit-client.component.html',
  styleUrls: ['./edit-client.component.scss'],
})
export class EditClientComponent {
  public clientGroup: FormGroup;
  public isLoading: boolean = false;
  private addedPhotos: File[] = [];
  private deleteIds: number[] = [];
  public currentPhotos: { id: number; src: string }[] = [];
  constructor(
    private fb: FormBuilder,
    private clientService: ClientService,
    private ref: DynamicDialogRef,
    private config: DynamicDialogConfig,
  ) {
    this.clientGroup = fb.group({
      autoPlay: [null, Validators.required],
      isUserCanLeaf: [false, Validators.required],
    });
    this.clientGroup.patchValue(config.data.client);
    this.currentPhotos = config.data.client.photos;
  }

  public editClient(): void {
    if (isFormInvalid(this.clientGroup)) return;
    this.isLoading = true;
    const review = this.clientGroup.getRawValue();
    const formData = new FormData();
    this.addedPhotos.map((photo) => {
      formData.append('photos[]', photo);
    });
    this.deleteIds.map((id) => {
      formData.append('deleteIds[]', id.toString());
    });
    formData.append('autoPlay', review.autoPlay);
    formData.append('isUserCanLeaf', review.isUserCanLeaf);
    this.clientService.addItem(formData).subscribe(() => {
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
