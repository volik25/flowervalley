import { Component, HostListener, OnInit } from '@angular/core';
import { BreadcrumbService } from '../../components/breadcrumb/breadcrumb.service';
import { AdminService } from '../../_services/back/admin.service';
import { ContactsService } from '../../_services/back/contacts.service';
import { ConfirmationService } from 'primeng/api';
import { DomSanitizer } from '@angular/platform-browser';
import { IdImg } from '../../_models/_idImg';

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
  ) {
    _bs.setItem('Контакты');
    adminService.checkAdmin().subscribe((isAdmin) => (this.isAdmin = isAdmin));
  }

  public ngOnInit(): void {
    this.updateWidth();
    this.contactService.getPhotos().subscribe((photos) => {
      this.photos = photos;
    });
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

  public deleteImage(id: number): void {
    this.cs.confirm({
      header: 'Подтвердите удаление фотографии',
      message: `Вы действительно хотите удалить фотографию?`,
      accept: () => {
        this.contactService.deleteItem(id).subscribe(() => {
          const index = this.photos.findIndex((photo) => photo.id === id);
          this.photos.splice(index, 1);
        });
      },
    });
  }
}
