import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import tinify from 'tinify/lib/tinify';

@Injectable({
  providedIn: 'root',
})
export class TinyPngService {
  private apiKey = 'r7g0kxxQhrlrW82XWFxdbyGtPNZwxTTf';

  constructor(private http: HttpClient) {}

  public convertImage(image: any, type: string): Promise<void> {
    tinify.key = this.apiKey;
    return tinify.fromFile(image.objectURL).toFile('compressed' + type);
  }
}
