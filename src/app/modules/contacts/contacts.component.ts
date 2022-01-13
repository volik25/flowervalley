import { Component, HostListener, OnInit } from '@angular/core';
import { BreadcrumbService } from '../../components/breadcrumb/breadcrumb.service';
import { AdminService } from '../../_services/back/admin.service';
import { ContactsService } from '../../_services/back/contacts.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DomSanitizer } from '@angular/platform-browser';
import { IdImg } from '../../_models/_idImg';
import { LoadingService } from '../../_services/front/loading.service';

@Component({
  selector: 'flower-valley-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.scss'],
})
export class ContactsComponent implements OnInit {
  public isAdmin: boolean = false;
  public photosWidth: string = '';
  public mapWidth: string = '';
  @HostListener('window:resize')
  private updateWidth() {
    if (window.innerWidth < 380) {
      this.photosWidth = (window.innerWidth - 54).toString();
      this.mapWidth = (window.innerWidth - 54).toString();
    } else if (window.innerWidth < 550) {
      this.photosWidth = '326';
      this.mapWidth = (window.innerWidth - 54).toString();
    } else {
      this.photosWidth = '380';
      this.mapWidth = '550';
    }
  }
  public displayCustom: boolean = false;
  public activeIndex: number = 0;
  public photos: IdImg[] = [];

  constructor(
    private _bs: BreadcrumbService,
    private adminService: AdminService,
    private contactService: ContactsService,
    private cs: ConfirmationService,
    private sanitizer: DomSanitizer,
    private ls: LoadingService,
    private ms: MessageService,
  ) {
    _bs.setItem('Контакты');
    adminService.checkAdmin().subscribe((isAdmin) => (this.isAdmin = isAdmin));
  }

  public ngOnInit(): void {
    this.updateWidth();
    const sub = this.contactService.getPhotos().subscribe((photos) => {
      this.photos = photos;
      this.ls.removeSubscription(sub);
    });
    this.ls.addSubscription(sub);
  }

  public openImage(id: number): void {
    this.activeIndex = this.photos.findIndex((photo) => photo.id === id);
    this.displayCustom = true;
  }

  public addPhoto(photos: File[]): void {
    const formData = new FormData();
    photos.map((photo) => {
      formData.append('img', photo);
      this.contactService.addItem(formData).subscribe((id: number) => {
        const url = ((<any>photo).objectURL = this.sanitizer.bypassSecurityTrustUrl(
          window.URL.createObjectURL(photo),
        ));
        this.photos.push({
          id: id,
          img: url as string,
        });
      });
    });
  }

  public editImage(photo: File[], id: number): void {
    const formData = new FormData();
    formData.append('img', photo[0]);
    this.contactService.updateItem(formData as any, id).subscribe(() => {
      const url = ((<any>photo[0]).objectURL = this.sanitizer.bypassSecurityTrustUrl(
        window.URL.createObjectURL(photo[0]),
      ));
      const index = this.photos.findIndex((photoItem) => photoItem.id === id);
      this.photos[index].img = url as string;
      this.ms.add({
        severity: 'success',
        summary: 'Фотография обновлена',
      });
    });
  }

  public deleteImage(id: number): void {
    this.cs.confirm({
      header: 'Подтвердите удаление фотографии',
      message: `Вы действительно хотите удалить фотографию?`,
      accept: () => {
        this.contactService.deleteItem(id).subscribe(() => {
          const index = this.photos.findIndex((photo) => photo.id === id);
          this.photos.splice(index, 1);
          this.ms.add({
            severity: 'success',
            summary: 'Фотография удалена',
          });
        });
      },
    });
  }
}
