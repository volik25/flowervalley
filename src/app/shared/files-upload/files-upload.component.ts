import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { FileUpload } from 'primeng/fileupload';
import { DomSanitizer } from '@angular/platform-browser';

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
  public files: string[] = [];
  @Input()
  public showOnlyButton: boolean = false;
  @Output()
  public uploaded: EventEmitter<File[]> = new EventEmitter<File[]>();
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

  public uploadFiles(files: File[]): void {
    this.photos = files;
    this.files = [];
    this.fileUpload?.clear();
    this.uploaded.emit(files);
  }

  private isImage(file: File): boolean {
    return /^image\//.test(file.type);
  }
}
