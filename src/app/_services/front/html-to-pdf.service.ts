import { Injectable } from '@angular/core';
// @ts-ignore
import pdfMake from 'pdfmake/build/pdfmake';
// @ts-ignore
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
// @ts-ignore
import htmlToPdfmake from 'html-to-pdfmake';

@Injectable({ providedIn: 'root' })
export class HtmlToPdfService {
  private header!: string[];
  private content!: any[];
  private delivery!: string;
  private boxes!: string;
  private productsSum!: string;
  private sum!: string;
  private order: number | undefined;
  private date: string | undefined;

  public getPDF(
    isClient: boolean,
    header: string[],
    content: any[],
    delivery: string,
    boxes: string,
    productsSum: string,
    sum: string,
    orderNumber?: number,
    date?: string,
  ): void {
    this.header = header;
    this.content = content;
    this.delivery = delivery;
    this.boxes = boxes;
    this.productsSum = productsSum;
    this.sum = sum;
    this.order = orderNumber;
    this.date = date;
    if (isClient) {
      HtmlToPdfService.getBase64ImageFromURL('assets/images/logo.png').then((res) => {
        const html = htmlToPdfmake(this.generateHTML(res).innerHTML, {
          tableAutoSize: true,
        });
        const documentDefinition = {
          content: html,
          info: { title: 'Смета Агрофирма Цветочная Долина' },
        };
        pdfMake.createPdf(documentDefinition).open();
      });
    } else {
      const html = htmlToPdfmake(this.generateHTML().innerHTML, {
        tableAutoSize: true,
      });
      const documentDefinition = {
        content: html,
        info: { title: `Смета по заказу №${orderNumber}` },
      };
      pdfMake.createPdf(documentDefinition).open();
    }
  }

  private generateHTML(imgSrc?: unknown): HTMLElement {
    const div = document.createElement('div');
    if (imgSrc) {
      const headerTable = HtmlToPdfService.genHeaderTable(imgSrc);
      div.append(headerTable);
    }
    if (this.date) {
      const h1 = document.createElement('h1');
      h1.innerText = `ДАТА ЗАКАЗА: ${this.date}`;
      h1.style.color = 'red';
      div.append(h1);
    }
    const h2 = document.createElement('h2');
    h2.innerText = 'Смета по заказу';
    if (this.order) {
      h2.innerText += ` №${this.order}`;
    }
    h2.style.textAlign = 'center';
    h2.style.margin = '0 0 20px 0';
    div.append(h2);
    const table = this.genMainTable();
    div.append(table);
    const products = document.createElement('div');
    products.innerHTML = 'Стоимость товаров: ' + this.productsSum;
    products.style.margin = '10px 0';
    div.append(products);
    const delivery = document.createElement('div');
    delivery.innerHTML = 'Стоимость доставки: ' + this.delivery;
    div.append(delivery);
    const boxes = document.createElement('div');
    boxes.innerHTML = 'Стоимость коробок: ' + this.boxes;
    boxes.style.margin = '10px 0';
    div.append(boxes);
    const sum = document.createElement('div');
    sum.innerHTML = 'Итоговая сумма: ' + this.sum;
    div.append(sum);
    return div;
  }

  public static getBase64ImageFromURL(url: string) {
    return new Promise((resolve, reject) => {
      const img = new Image();

      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;

        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0);

        const dataURL = canvas.toDataURL('image/png');

        resolve(dataURL);
      };

      img.onerror = (error) => {
        reject(error);
      };

      img.src = url;
    });
  }

  public static genHeaderTable(imgSrc: unknown): HTMLTableElement {
    const img = document.createElement('img');
    if (typeof imgSrc === 'string') {
      img.setAttribute('src', imgSrc);
      img.setAttribute('width', '100');
    }
    const title = document.createElement('div');
    title.innerHTML = `<b>Агрофирма Цветочная Долина</b>`;
    title.style.textAlign = 'left';
    const headerTable: HTMLTableElement = document.createElement('table');
    headerTable.style.border = '0';
    const htHead = headerTable.createTHead();
    const htBody = headerTable.createTBody();
    const row = htHead.insertRow(0);
    const leftCol = row.insertCell(0);
    const centerCol = row.insertCell(1);
    const rightCol = row.insertCell(2);
    leftCol.style.width = '15%';
    leftCol.style.border = '0';
    centerCol.style.width = '20%';
    centerCol.style.border = '0';
    rightCol.style.width = '65%';
    rightCol.style.border = '0';
    const headerTableBodyRow = htBody.insertRow(0);
    const image = headerTableBodyRow.insertCell(0);
    image.append(img);
    image.style.border = '0';
    const titleCell = headerTableBodyRow.insertCell(1);
    titleCell.append(title);
    titleCell.style.border = '0';
    const address = headerTableBodyRow.insertCell(2);
    const addressInfo = document.createElement('div');
    addressInfo.innerText =
      '140125, Моск. обл., Раменский р-н., д. Островцы, ул. Подмосковная д. 22 A теплица 109';
    const email = document.createElement('div');
    email.innerText = 'flowervalley@mail.ru';
    email.style.margin = '10px 0';
    const phone = document.createElement('div');
    phone.innerText = '+7 915 109 1000';
    address.append(addressInfo, email, phone);
    address.style.border = '0';
    address.style.textAlign = 'right';
    return headerTable;
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
        cell.style.width = '50%';
      } else {
        cell.style.width = '16.6%';
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
