import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { VideoService } from '../../../../_services/back/video.service';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { isFormInvalid } from '../../../../_utils/formValidCheck';
import { Video } from '../../../../_models/video';

@Component({
  selector: 'flower-valley-edit-video',
  templateUrl: './edit-video.component.html',
  styleUrls: ['../add-video/add-video.component.scss'],
})
export class EditVideoComponent {
  public videoGroup: FormGroup;
  public isLinkCopied: boolean = false;
  public isLoading: boolean = false;
  constructor(
    private fb: FormBuilder,
    private videoService: VideoService,
    private ref: DynamicDialogRef,
    private config: DynamicDialogConfig,
  ) {
    this.videoGroup = fb.group({
      id: [''],
      src: ['', Validators.required],
      title: ['', Validators.required],
      description: ['', Validators.required],
    });
    this.videoGroup.patchValue(config.data.video);
  }

  public editVideo(): void {
    if (isFormInvalid(this.videoGroup)) return;
    this.isLoading = true;
    const video = this.videoGroup.getRawValue();
    this.videoService.updateItem<Video>(video).subscribe(() => {
      this.isLoading = false;
      this.ref.close({
        success: true,
        video: video,
      });
    });
  }
}
