import { Injectable } from '@angular/core';
import { HtmlToPdfService } from './html-to-pdf.service';
// @ts-ignore
import pdfMake from 'pdfmake/build/pdfmake';
// @ts-ignore
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
// @ts-ignore
import htmlToPdfmake from 'html-to-pdfmake';

@Injectable({
  providedIn: null,
})
export class OfferGenerateService {
  private orderNumber!: number;
  private date!: string;
  private client!: string;
  private categories!: string[];
  private content!: any[];
  private sum!: number;

  public getPDF(
    orderNumber: number,
    date: string,
    client: string,
    categories: string[],
    content: any[],
    sum: number,
  ): void {
    this.orderNumber = orderNumber;
    this.date = date;
    this.client = client;
    this.categories = categories;
    this.content = content;
    this.sum = sum;
    HtmlToPdfService.getBase64ImageFromURL('assets/images/logo.png').then((logo) => {
      HtmlToPdfService.getBase64ImageFromURL('assets/images/sign.png').then((sign) => {
        const html = htmlToPdfmake(this.generateHTML(logo, sign).innerHTML, {
          tableAutoSize: true,
        });
        const documentDefinition = {
          content: html,
          info: { title: 'Коммерческое предложение' },
        };
        pdfMake.createPdf(documentDefinition).open();
      });
    });
  }

  private generateHTML(logo: unknown, sign: unknown): HTMLElement {
    const div = document.createElement('div');
    const headerTable = OfferGenerateService.genHeaderTable(logo);
    div.append(headerTable);
    const bodyHeaderTable = this.genBodyTitle();
    div.append(bodyHeaderTable);
    const bodyTable = this.genBodyTable();
    div.append(bodyTable);
    const footerTable = OfferGenerateService.genFooterTable(sign);
    div.append(footerTable);
    return div;
  }

  private static genHeaderTable(logo: unknown): HTMLTableElement {
    const img = document.createElement('img');
    if (typeof logo === 'string') {
      img.setAttribute('src', logo);
      img.setAttribute('width', '100');
    }
    const headerTable: HTMLTableElement = document.createElement('table');
    headerTable.style.border = '0';
    const htHead = headerTable.createTHead();
    const htBody = headerTable.createTBody();
    const row = htHead.insertRow(0);
    const leftHead = row.insertCell(0);
    const centerHead = row.insertCell(1);
    const rightHead = row.insertCell(2);
    leftHead.style.width = '50%';
    leftHead.style.border = '0';
    centerHead.style.width = '20%';
    centerHead.style.border = '0';
    rightHead.style.width = '30%';
    rightHead.style.border = '0';
    const headerTableBodyRow1 = htBody.insertRow(0);
    const headerTableBodyRow2 = htBody.insertRow(1);
    const headerTableBodyRow3 = htBody.insertRow(2);
    const payment = headerTableBodyRow1.insertCell(0);
    payment.rowSpan = 3;
    payment.innerHTML = OfferGenerateService.getPaymentText();
    payment.style.border = '0';
    payment.style.fontSize = '14px';
    const image = headerTableBodyRow1.insertCell(1);
    image.rowSpan = 2;
    image.append(img);
    image.style.textAlign = 'right';
    image.style.border = '0';
    const title = headerTableBodyRow1.insertCell(2);
    title.innerHTML = this.getTitleText();
    title.style.border = '0';
    const contacts = headerTableBodyRow2.insertCell(0);
    contacts.innerHTML = this.getContacts();
    contacts.style.fontSize = '14px';
    contacts.style.textAlign = 'right';
    contacts.style.border = '0';
    const address = headerTableBodyRow3.insertCell(0);
    address.colSpan = 2;
    address.innerHTML = this.getAddress();
    address.style.textAlign = 'right';
    address.style.border = '0';
    OfferGenerateService.insertSpaceRow(3, htBody, 3, 3);
    const headerTableBodyLine = htBody.insertRow(4);
    const lineCell = headerTableBodyLine.insertCell(0);
    lineCell.colSpan = 3;
    lineCell.style.borderLeft = '0';
    lineCell.style.borderRight = '0';
    return headerTable;
  }

  private static getPaymentText(): string {
    return `<b>Индивидуальный Предприниматель<br/>
            Большаков Олег Валентинович<br/>
            ИНН - 771601384607<br/>
            ОГРНИП – 307770000627581<br/>
            Расчетный счет – 40802810277010000460<br/>
            Кор.счет - 30101810145250000411<br/>
            Адрес - 129323, Москва, ул.Седова, дом 2,<br/>
            корп.2, оф.56<br/>
            Банк получателя – Филиал «ЦЕНТРАЛЬНЫЙ»<br/>
            Банка ВТБ (ПАО) г. Москва</b>`;
  }

  private static getTitleText(): string {
    const title = document.createElement('b');
    title.innerHTML = `Агрофирма<br/>
                        Цветочная Долина<br/>`;
    title.style.fontSize = '20px';
    const subTitle = document.createElement('span');
    subTitle.innerHTML = 'Тепличное хозяйство';
    subTitle.style.color = 'grey';
    const returned = document.createElement('div');
    returned.append(title, subTitle);
    return returned.innerHTML;
  }

  private static getContacts(): string {
    return `<b>Тел. – +7 (915) 109 10 00<br/>
            Почта - flowervalley@mail.ru</b>`;
  }

  private static getAddress(): string {
    return `<b>Адрес - 140125, Моск. обл., Раменский р-н.,<br/>
            д. Островцы, ул. Подмосковная д. 22 A<br/>
            теплица 109</b>`;
  }

  private genBodyTitle(): HTMLTableElement {
    const headerTitleTable = document.createElement('table');
    const head = headerTitleTable.createTHead();
    const body = headerTitleTable.createTBody();
    const row = head.insertRow(0);
    const headCell = row.insertCell(0);
    headCell.style.width = '100%';
    headCell.style.border = '0';
    const offerNumberRow = body.insertRow(0);
    const offerNumberCell = offerNumberRow.insertCell(0);
    offerNumberCell.innerHTML = `<b>№${this.orderNumber} от ${this.date}</b>`;
    offerNumberCell.style.border = '0';
    OfferGenerateService.insertSpaceRow(1, body, 1);
    const offerClientRow = body.insertRow(2);
    const offerClientCell = offerClientRow.insertCell(0);
    offerClientCell.innerHTML = `<b>${this.client}</b>`;
    offerClientCell.style.border = '0';
    OfferGenerateService.insertSpaceRow(4, body, 3);
    const offerTitleRow = body.insertRow(4);
    const offerTitleCell = offerTitleRow.insertCell(0);
    offerTitleCell.innerHTML = `<b>Коммерческое предложение</b>`;
    offerTitleCell.style.border = '0';
    offerTitleCell.style.fontSize = '24px';
    offerTitleCell.style.textAlign = 'center';
    OfferGenerateService.insertSpaceRow(1, body, 5);
    const offerTextRow = body.insertRow(6);
    const offerTextCell = offerTextRow.insertCell(0);
    offerTextCell.innerHTML =
      'Мы готовы поставить следующие товары, исходя из списка Вашей заявки.';
    offerTextCell.style.border = '0';
    offerTextCell.style.fontSize = '14px';
    offerTextCell.style.textAlign = 'center';
    OfferGenerateService.insertSpaceRow(1, body, 7);
    return headerTitleTable;
  }

  private genBodyTable(): HTMLTableElement {
    const header = ['№', 'Товар', 'Ед.', 'Цена', 'Кол-во', 'Сумма'];
    const table: HTMLTableElement = document.createElement('table');
    const tHead = table.createTHead();
    const tBody = table.createTBody();
    const headerRow = tHead.insertRow(0);
    for (let i = 0; i < header.length; i++) {
      const cell = headerRow.insertCell(i);
      cell.innerHTML = header[i];
      switch (i) {
        case 0:
          cell.style.width = '5%';
          break;
        case 1:
          cell.style.width = '45%';
          break;
        default:
          cell.style.width = '12.5%';
          break;
      }
      cell.style.textAlign = 'center';
      cell.style.fontWeight = 'bold';
    }
    for (let i = 0; i < this.content.length; i++) {
      const abstractRow = this.content[i];
      const bodyRow = tBody.insertRow(i);
      const index = bodyRow.insertCell(0);
      index.innerHTML = `${i + 1}`;
      index.style.textAlign = 'center';
      for (let j = 0; j < abstractRow.length; j++) {
        const cell = bodyRow.insertCell(j + 1);
        cell.innerHTML = `${abstractRow[j]}`;
        if (j > 0) {
          cell.style.textAlign = 'center';
        }
      }
    }
    const lastRow = tBody.insertRow(this.content.length);
    const emptyCell = lastRow.insertCell(0);
    emptyCell.colSpan = 4;
    emptyCell.style.border = '0';
    const labelCell = lastRow.insertCell(1);
    labelCell.innerHTML = `<b>Итого:</b>`;
    const sumCell = lastRow.insertCell(2);
    sumCell.innerHTML = this.sum.toString();
    sumCell.style.textAlign = 'center';
    return table;
  }

  private static genFooterTable(sign: unknown) {
    const img = document.createElement('img');
    if (typeof sign === 'string') {
      img.setAttribute('src', sign);
      img.setAttribute('width', '600');
    }
    const footerTable: HTMLTableElement = document.createElement('table');
    footerTable.style.border = '0';
    const ftHead = footerTable.createTHead();
    const ftBody = footerTable.createTBody();
    const headRow = ftHead.insertRow(0);
    const headCell = headRow.insertCell(0);
    headCell.style.width = '100%';
    headCell.style.border = '0';
    const signRow = ftBody.insertRow(0);
    const signCell = signRow.insertCell(0);
    signCell.style.border = '0';
    signCell.style.textAlign = 'center';
    signCell.append(img);
    return footerTable;
  }

  private static insertSpaceRow(
    spaces: number,
    section: HTMLTableSectionElement,
    index: number,
    colSpan?: number,
  ) {
    const spaceRow = section.insertRow(index);
    const spaceCell = spaceRow.insertCell(0);
    if (colSpan) spaceCell.colSpan = colSpan;
    spaceCell.style.border = '0';
    let space = '';
    for (let i = 0; i < spaces; i++) {
      space += `<br/>`;
    }
    spaceCell.innerHTML = space;
  }
}
