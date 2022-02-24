import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { FileUpload } from 'primeng/fileupload';
// @ts-ignore
import watermark from 'watermarkjs/dist/watermark';
import { DataUrl, NgxImageCompressService } from 'ngx-image-compress';

@Component({
  selector: 'flower-valley-files-upload',
  templateUrl: './files-upload.component.html',
  styleUrls: ['./files-upload.component.scss'],
  providers: [NgxImageCompressService],
})
export class FilesUploadComponent {
  @ViewChild('fileUpload')
  public fileUpload: FileUpload | undefined;
  @Input()
  public multi: boolean = true;
  @Input()
  public label: string = 'Загрузить изображения';
  @Input()
  public showOnlyButton: boolean = false;
  @Output()
  public uploaded: EventEmitter<File[]> = new EventEmitter<File[]>();
  public localUrl: string[] = [];
  public localCompressedUrl: string[] = [];
  private compressedFiles: File[] = [];
  public isWatermark: boolean = false;
  constructor(private imageCompress: NgxImageCompressService) {}

  public async uploadFiles(files: File[]): Promise<void> {
    files.map((file) => {
      this.genLocalUrl(file);
    });
    this.fileUpload?.clear();
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
    this.localUrl.splice(i, 1);
    this.localCompressedUrl.splice(i, 1);
    this.compressedFiles.splice(i, 1);
    this.uploaded.emit(this.compressedFiles);
  }

  private async genLocalUrl(file: File) {
    const fileName = file.name;
    const reader = new FileReader();
    reader.onload = (event: any) => {
      if (!this.multi && this.localUrl.length) {
        this.localUrl = [event.target.result];
      } else {
        this.localUrl = this.localUrl.concat(event.target.result);
      }
      this.compressFile(event.target.result, fileName);
    };
    if (this.isWatermark) {
      reader.readAsDataURL(await this.setWatermark(file));
    } else {
      reader.readAsDataURL(file);
    }
  }
  private compressFile(image: string, fileName: string) {
    let orientation = -1;
    this.imageCompress.compressFile(image, orientation, 50, 100).then((result) => {
      let file = new File([this.dataURItoBlob(result.split(',')[1])], fileName);
      if (!this.multi && this.localUrl.length) {
        this.localCompressedUrl = [result];
        this.compressedFiles = [file];
      } else {
        this.localCompressedUrl = this.localCompressedUrl.concat(result);
        this.compressedFiles = this.compressedFiles.concat(file);
      }
      this.uploaded.emit(this.compressedFiles);
    });
  }

  private dataURItoBlob(dataURI: DataUrl): Blob {
    const byteString = window.atob(dataURI);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const int8Array = new Uint8Array(arrayBuffer);
    for (let i = 0; i < byteString.length; i++) {
      int8Array[i] = byteString.charCodeAt(i);
    }
    return new Blob([int8Array], { type: 'image/jpeg' });
  }
}
