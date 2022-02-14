import { Component, Input } from '@angular/core';
import { Media } from '../../../_models/media';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { MediaService } from '../../../_services/back/media.service';

@Component({
  selector: 'flower-valley-media',
  templateUrl: './media.component.html',
  styleUrls: ['./media.component.scss'],
})
export class MediaComponent {
  @Input()
  public isAdmin: boolean = false;
  @Input()
  public media: Media[] = [];

  constructor(
    private router: Router,
    private cs: ConfirmationService,
    private ms: MessageService,
    private mediaService: MediaService,
  ) {}

  public openLink(link: string): void {
    window.open(link);
  }

  public editMedia(id: number): void {
    this.router.navigate(['admin/edit/media', id]);
  }

  public deleteMedia(id: number): void {
    this.cs.confirm({
      header: 'Подтвердите удаление статьи',
      message: 'Вы действительно хотите удалить статью?',
      accept: () => {
        this.mediaService.deleteItem(id).subscribe(() => {
          const index = this.media.findIndex((item) => item.id === id);
          this.media.splice(index, 1);
          this.ms.add({
            severity: 'success',
            summary: 'Запрос выполнен',
            detail: 'Статья успешно удалена',
          });
        });
      },
    });
  }
}
