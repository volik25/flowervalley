import { Injectable } from '@angular/core';
// @ts-ignore
import pdfMake from 'pdfmake/build/pdfmake';
// @ts-ignore
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
// @ts-ignore
import htmlToPdfmake from 'html-to-pdfmake';
import { HtmlToPdfService } from './html-to-pdf.service';

@Injectable({ providedIn: 'root' })
export class PriceListGenerateService {
  private header!: string[];
  private content!: any[];

  public getPDF(header: string[], content: any[]): void {
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
      pdfMake.createPdf(documentDefinition).open();
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
    for (let i = 0; i < this.content.length; i++) {
      const abstractRow = this.content[i];
      const bodyRow = tBody.insertRow(i);
      for (let j = 0; j < abstractRow.length; j++) {
        const cell = bodyRow.insertCell(j);
        cell.innerHTML = abstractRow[j];
        if (j > 0) {
          cell.style.textAlign = 'right';
        }
      }
    }
    return table;
  }
}
