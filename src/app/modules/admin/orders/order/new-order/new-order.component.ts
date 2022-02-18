import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OrderService } from '../../../../../_services/back/order.service';
import { Order, OrderBox, OrderProduct } from '../../../../../_models/order';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { isFormInvalid } from '../../../../../_utils/formValidCheck';
import { debounceTime, takeUntil } from 'rxjs';
import { YaMapService } from '../../../../../_services/front/ya-map.service';
import { DestroyService } from '../../../../../_services/front/destroy.service';
import { LoadingService } from '../../../../../_services/front/loading.service';

@Component({
  selector: 'flower-valley-new-order',
  templateUrl: './new-order.component.html',
  styleUrls: ['./new-order.component.scss'],
  providers: [DestroyService, YaMapService],
})
export class NewOrderComponent implements OnInit {
  private orderId: number | undefined;
  public products: OrderProduct[] = [];
  public boxes: OrderBox[] = [];
  public orderGroup: FormGroup;
  public shippingCost: number | undefined;
  public delivery_error: string = '';
  public showDelivery = false;
  constructor(
    private orderService: OrderService,
    private fb: FormBuilder,
    private ls: LoadingService,
    private route: ActivatedRoute,
    private yaMap: YaMapService,
    private $destroy: DestroyService,
    private cdr: ChangeDetectorRef,
  ) {
    this.orderGroup = fb.group({
      clientId: [''],
      clientInn: [''],
      accountNumber: [''],
      requestNumber: [''],
      clientName: ['', Validators.required],
      clientPhone: ['', Validators.required],
      clientEmail: ['', Validators.required],
      clientAddress: ['', Validators.required],
      deliveryPrice: ['', Validators.required],
    });
    route.queryParams.subscribe((params) => {
      this.orderId = params['orderId'];
    });
    this.orderGroup.controls['clientAddress'].valueChanges
      .pipe(takeUntil($destroy), debounceTime(1000))
      .subscribe((address) => {
        this.shippingCost = 0;
        this.showDelivery = false;
        this.delivery_error = '';
        if (address) {
          yaMap.addressChanged.next(address);
        } else {
          cdr.detectChanges();
        }
      });
    yaMap
      .calculateShippingCost()
      .pipe(takeUntil(this.$destroy))
      .subscribe((calculationResult) => {
        this.shippingCost = calculationResult;
        if (this.shippingCost === 0) {
          this.delivery_error = 'Адрес не найден';
        }
        this.cdr.detectChanges();
      });
  }

  ngOnInit(): void {
    if (this.orderId) {
      const sub = this.orderService.getItemById<Order>(this.orderId).subscribe((order) => {
        this.products = order.products;
        this.boxes = order.boxes;
        this.orderGroup.patchValue(order);
        this.ls.removeSubscription(sub);
        // console.log(order);
      });
      this.ls.addSubscription(sub);
    }
  }

  public createOrder(): void {
    if (isFormInvalid(this.orderGroup)) return;
  }

  public deliveryButtonClick(): void {
    this.showDelivery = true;
    this.cdr.detectChanges();
  }
}
