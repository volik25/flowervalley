import { Injectable } from '@angular/core';
// @ts-ignore
import pdfMake from 'pdfmake/build/pdfmake';
// @ts-ignore
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
// @ts-ignore
import htmlToPdfmake from 'html-to-pdfmake';
import { HtmlToPdfService } from './html-to-pdf.service';
import { Category } from '../../_models/category';
import { Product } from '../../_models/product';
import { ProductService } from '../back/product.service';
import { CatalogService } from '../back/catalog.service';
import { forkJoin, Observable, Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PriceListGenerateService {
  private header!: string[];
  private content!: any[];
  private _generatedDocument: Subject<Blob> = new Subject<Blob>();

  constructor(private productService: ProductService, private catalogService: CatalogService) {}

  public generatePriceList(categories?: Category[], products?: Product[]): void {
    const headers = ['Товар', 'Упаковка', 'Цена за шт.'];
    const pricesContent: any[] = [];
    if (categories && products) {
      categories
        .sort((a, b) => a.id - b.id)
        .map((category) => {
          pricesContent.push(
            [category.name],
            ...products
              .filter((item) => item.categoryId === category.id)
              .map((item) => [item.name, item.coefficient, item.price]),
          );
        });
      this.getPDF(headers, pricesContent);
    } else {
      const requests = [this.productService.getItems(), this.catalogService.getItems()];
      forkJoin(requests).subscribe(([loadedProducts, loadedCategories]) => {
        (loadedCategories as Category[])
          .sort((a, b) => a.id - b.id)
          .filter((category) => category.id !== 1)
          .filter((category) => !category.parentId)
          .map((category) => {
            pricesContent.push(
              [category.name],
              ...(loadedProducts as Product[])
                .filter((item) => item.categoryId === category.id)
                .map((item) => [item.name, item.coefficient, item.price]),
            );
          });
        this.getPDF(headers, pricesContent);
      });
    }
  }

  private getPDF(header: string[], content: any[]): void {
    this.header = header;
    this.content = content;
    HtmlToPdfService.getBase64ImageFromURL('assets/images/logo.png').then((res) => {
      const html = htmlToPdfmake(this.generateHTML(res).innerHTML, {
        tableAutoSize: true,
      });
      const documentDefinition = {
        content: html,
        info: { title: 'Прайс-лист Агрофирма Цветочная Долина' },
      };
      const document = pdfMake.createPdf(documentDefinition);
      document.open();
      document.getBlob((blob: Blob) => {
        this._generatedDocument.next(blob);
      });
    });
  }

  private generateHTML(imgSrc: unknown): HTMLElement {
    const div = document.createElement('div');
    const headerTable = HtmlToPdfService.genHeaderTable(imgSrc);
    div.append(headerTable);
    const h2 = document.createElement('h2');
    h2.innerText = 'Прайс-лист';
    h2.style.textAlign = 'center';
    h2.style.margin = '0 0 20px 0';
    div.append(h2);
    const table = this.genMainTable();
    div.append(table);
    return div;
  }

  private genMainTable(): HTMLTableElement {
    const table: HTMLTableElement = document.createElement('table');
    const tHead = table.createTHead();
    const tBody = table.createTBody();
    const headerRow = tHead.insertRow(0);
    for (let i = 0; i < this.header.length; i++) {
      const cell = headerRow.insertCell(i);
      cell.innerHTML = this.header[i];
      if (i === 0) {
        cell.style.width = '60%';
      } else {
        cell.style.width = '20%';
        cell.style.textAlign = 'center';
      }
    }
    this.content.sort((a, b) => {
      if (a[1] && b[1]) {
        if (a[0].split(' ').join('')[0] > b[0].split(' ').join('')[0]) return 1;
        if (a[0].split(' ').join('')[0] < b[0].split(' ').join('')[0]) return -1;
        return 0;
      }
      return 0;
    });
    for (let i = 0; i < this.content.length; i++) {
      const abstractRow = this.content[i];
      const bodyRow = tBody.insertRow(i);
      for (let j = 0; j < abstractRow.length; j++) {
        const cell = bodyRow.insertCell(j);
        cell.innerHTML = abstractRow[j];
        if (abstractRow.length === 1) {
          cell.colSpan = 3;
          cell.style.textTransform = 'uppercase';
          cell.style.fontSize = '22px';
        }
        if (j > 0) {
          cell.style.textAlign = 'right';
        }
      }
    }
    return table;
  }

  public getGeneratedDocument(): Observable<Blob> {
    return this._generatedDocument.asObservable();
  }
}
