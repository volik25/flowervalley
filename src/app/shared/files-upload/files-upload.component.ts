import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { FileUpload } from 'primeng/fileupload';
// @ts-ignore
import watermark from 'watermarkjs/dist/watermark';

@Component({
  selector: 'flower-valley-files-upload',
  templateUrl: './files-upload.component.html',
  styleUrls: ['./files-upload.component.scss'],
})
export class FilesUploadComponent {
  @ViewChild('fileUpload')
  public fileUpload: FileUpload | undefined;
  private _photos: File[] = [];
  @Input()
  public multi: boolean = true;
  @Input()
  public label: string = 'Загрузить изображения';
  @Input()
  public showOnlyButton: boolean = false;
  @Output()
  public uploaded: EventEmitter<File[]> = new EventEmitter<File[]>();
  public isWatermark: boolean = false;
  constructor(private sanitizer: DomSanitizer) {}

  public set photos(files) {
    this._photos = [];
    files.map((file) => {
      if (this.isImage(file)) {
        (<any>file).objectURL = this.sanitizer.bypassSecurityTrustUrl(
          window.URL.createObjectURL(file),
        );
        this._photos.push(file);
      }
    });
  }

  public get photos(): any[] {
    return this._photos;
  }

  public async uploadFiles(files: File[]): Promise<void> {
    if (this.isWatermark) {
      await Promise.all(
        files.map(async (file) => {
          const img = await this.setWatermark(file);
          this.photos = [...this.photos, img];
        }),
      );
      this.fileUpload?.clear();
      this.uploaded.emit(this.photos);
    } else {
      this.photos = this.photos.concat(files);
      this.fileUpload?.clear();
      this.uploaded.emit(this.photos);
    }
  }

  public setWatermark(file: File): Promise<Blob> {
    return watermark([file, 'assets/images/logo.png']).blob((img: any, logo: any) => {
      let context = img.getContext('2d');
      context.save();
      context.globalAlpha = 0.7;
      context.drawImage(logo, 10, 10, 150, 123.55);

      context.restore();
      return img;
    });
  }

  public removeImage(i: number): void {
    this.photos.splice(i, 1);
    this.uploaded.emit(this.photos);
  }

  private isImage(file: File): boolean {
    return /^image\//.test(file.type);
  }
}
