import { Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root',
})
export class SEOService {
  constructor(private title: Title, private meta: Meta) {}

  public updateTitle(title: string, isMain = false) {
    this.title.setTitle(`${title}${!isMain ? ' | Агрофирма Цветочная Долина' : ''}`);
  }

  public updateKeywords(keywords: string) {
    this.meta.updateTag({ name: 'keywords', content: keywords });
  }

  public updateDescription(desc: string) {
    this.meta.updateTag({ name: 'description', content: desc });
  }
}
