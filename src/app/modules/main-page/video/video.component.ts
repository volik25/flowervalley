import { Component, Input } from '@angular/core';
import { Video } from '../../../_models/video';
import { DialogService } from 'primeng/dynamicdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { VideoService } from '../../../_services/back/video.service';
import { EditVideoComponent } from './edit-video/edit-video.component';

@Component({
  selector: 'flower-valley-video',
  templateUrl: './video.component.html',
  styleUrls: ['./video.component.scss'],
  providers: [DialogService],
})
export class VideoComponent {
  @Input()
  public isAdmin: boolean = false;
  @Input()
  public videos: Video[] = [];

  constructor(
    private ds: DialogService,
    private ms: MessageService,
    private cs: ConfirmationService,
    private videoService: VideoService,
  ) {}

  public editVideo(video: Video): void {
    const editModal = this.ds.open(EditVideoComponent, {
      header: 'Редактировать видео',
      width: '600px',
      data: {
        video: video,
      },
    });
    editModal.onClose.subscribe((res: { success: boolean; video: Video }) => {
      if (res && res.success) {
        const index = this.videos.findIndex((item) => item.id === video.id);
        this.videos[index] = res.video;
        this.ms.add({
          severity: 'success',
          summary: 'Запрос выполнен',
          detail: 'Видео отредактировано',
        });
      }
    });
  }

  public deleteVideo(id: number): void {
    this.cs.confirm({
      header: 'Подтвердите удаление ссылки',
      message: 'Вы действительно хотите удалить ссылку на видео?',
      accept: () => {
        this.videoService.deleteItem(id).subscribe(() => {
          const index = this.videos.findIndex((video) => video.id === id);
          this.videos.splice(index, 1);
          this.ms.add({
            severity: 'success',
            summary: 'Запрос выполнен',
            detail: 'Ссылка на видео успешно удалена',
          });
        });
      },
    });
  }
}
