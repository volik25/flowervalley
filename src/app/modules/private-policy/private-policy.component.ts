import { Component, OnInit } from '@angular/core';
import { StaticDataService } from '../../_services/back/static-data.service';
import { LoadingService } from '../../_services/front/loading.service';
import { PrivatePolicy } from '../../_models/static-data/private-policy';

@Component({
  selector: 'flower-valley-private-policy',
  templateUrl: './private-policy.component.html',
  styleUrls: ['./private-policy.component.scss'],
})
export class PrivatePolicyComponent implements OnInit {
  public privatePolicy: PrivatePolicy | undefined;

  constructor(private staticData: StaticDataService, private ls: LoadingService) {}

  ngOnInit() {
    const staticSub = this.staticData.getPrivatePolicyContent().subscribe((data) => {
      this.privatePolicy = data;
      this.ls.removeSubscription(staticSub);
    });
    this.ls.addSubscription(staticSub);
  }
}
