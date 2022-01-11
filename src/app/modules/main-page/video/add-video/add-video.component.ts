import { Component } from '@angular/core';
import { Video } from '../../../../_models/video';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { VideoService } from '../../../../_services/back/video.service';
import { isFormInvalid } from '../../../../_utils/formValidCheck';
import { DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'flower-valley-add-video',
  templateUrl: './add-video.component.html',
  styleUrls: ['./add-video.component.scss'],
})
export class AddVideoComponent {
  public videoGroup: FormGroup;
  public isLinkCopied: boolean = false;
  public isLoading: boolean = false;
  constructor(
    private fb: FormBuilder,
    private videoService: VideoService,
    private ref: DynamicDialogRef,
  ) {
    this.videoGroup = fb.group({
      src: ['', Validators.required],
      title: ['', Validators.required],
      description: ['', Validators.required],
    });
  }

  public addVideo(): void {
    if (isFormInvalid(this.videoGroup)) return;
    this.isLoading = true;
    const video = this.videoGroup.getRawValue();
    this.videoService.addItem<Video>(video).subscribe((id) => {
      this.isLoading = false;
      this.ref.close({
        success: true,
        video: <Video>{
          ...video,
          id: Number(id),
        },
      });
    });
  }
}
