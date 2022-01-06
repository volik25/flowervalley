import { Component } from '@angular/core';
import { BusinessPackService } from '../../../_services/back/business-paсk.service';

@Component({
  selector: 'flower-valley-download-invoice',
  templateUrl: './download-invoice.component.html',
  styleUrls: ['./download-invoice.component.scss'],
})
export class DownloadInvoiceComponent {
  public window = window;
  public telepakId: string;
  constructor(private bpService: BusinessPackService) {
    this.telepakId = bpService.telepakId;
  }
}
