import { Injectable } from '@angular/core';
// @ts-ignore
import pdfMake from 'pdfmake/build/pdfmake';
// @ts-ignore
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
// @ts-ignore
import htmlToPdfmake from 'html-to-pdfmake';

@Injectable({ providedIn: null })
export class HtmlToPdfService {
  private header!: string[];
  private content!: any[];
  private delivery!: string;
  private boxes!: string;
  private productsSum!: string;
  private sum!: string;

  public getPDF(
    header: string[],
    content: any[],
    delivery: string,
    boxes: string,
    productsSum: string,
    sum: string,
  ): void {
    this.header = header;
    this.content = content;
    this.delivery = delivery;
    this.boxes = boxes;
    this.productsSum = productsSum;
    this.sum = sum;
    const html = htmlToPdfmake(this.generateHTML().innerHTML);
    const documentDefinition = { content: html };
    pdfMake.createPdf(documentDefinition).download('Смета.pdf');
  }

  private generateHTML(): HTMLElement {
    const div = document.createElement('div');
    const h2 = document.createElement('h2');
    h2.innerHTML = 'Смета по заказу';
    div.append(h2);
    const table: HTMLTableElement = document.createElement('table');
    const tHead = table.createTHead();
    const tBody = table.createTBody();
    const headerRow = tHead.insertRow(0);
    for (let i = 0; i < this.header.length; i++) {
      const cell = headerRow.insertCell(i);
      cell.innerHTML = this.header[i];
    }
    for (let i = 0; i < this.content.length; i++) {
      const abstractRow = this.content[i];
      const bodyRow = tBody.insertRow(i);
      for (let j = 0; j < abstractRow.length; j++) {
        const cell = bodyRow.insertCell(j);
        cell.innerHTML = abstractRow[j];
      }
    }
    div.append(table);
    const products = document.createElement('div');
    products.innerHTML = 'Стоимость товаров: ' + this.productsSum;
    div.append(products);
    const delivery = document.createElement('div');
    delivery.innerHTML = 'Стоимость доставки: ' + this.delivery;
    div.append(delivery);
    const boxes = document.createElement('div');
    boxes.innerHTML = 'Стоимость коробок: ' + this.boxes;
    div.append(boxes);
    const sum = document.createElement('div');
    sum.innerHTML = 'Итоговая сумма: ' + this.sum;
    div.append(sum);
    return div;
  }
}
