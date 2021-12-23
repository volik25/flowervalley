import { ChangeDetectorRef, Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DestroyService } from '../../../services/destroy.service';
import { debounceTime, takeUntil } from 'rxjs';
import { YaMapService } from '../../../services/ya-map.service';

@Component({
  selector: 'flower-valley-order-confirmation',
  templateUrl: './order-confirmation.component.html',
  styleUrls: ['./order-confirmation.component.scss'],
  providers: [DestroyService, YaMapService],
})
export class OrderConfirmationComponent {
  @ViewChild('mapContent') public mapContent: ElementRef<HTMLElement> | undefined;
  @ViewChild('yamap') public map: ElementRef<HTMLElement> | undefined;
  public clientType: 'individual' | 'entity' = 'individual';
  public pickUp: FormControl;
  public contacts: FormGroup;
  public entityData: FormGroup;
  public shippingCost: number | undefined;
  public delivery_error: string = '';
  public showDelivery = false;
  public showMap = false;

  constructor(
    private fb: FormBuilder,
    private $destroy: DestroyService,
    private yaMap: YaMapService,
    private cdr: ChangeDetectorRef,
  ) {
    yaMap.orderConfirmationComponent = this;
    this.pickUp = fb.control(false);
    this.contacts = fb.group({
      name: ['', [Validators.required]],
      phone: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      address: [''],
    });
    this.entityData = fb.group({
      name: ['', Validators.required],
    });
    this.contacts.controls['address'].valueChanges
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
        switch (this.shippingCost) {
          case 0:
            this.delivery_error = 'Адрес не найден';
            break;
          case 2500:
            break;
          default:
            this.shippingCost = 2500 + 50 * calculationResult;
        }
        this.cdr.detectChanges();
      });
    this.pickUp.valueChanges.subscribe((value) => {
      if (value) {
        this.shippingCost = undefined;
        this.showDelivery = false;
        this.contacts.controls['address'].setValue('');
        this.contacts.controls['address'].disable();
      } else {
        this.contacts.controls['address'].enable();
      }
    });
  }

  public deliveryButtonClick(): void {
    this.showDelivery = true;
    this.cdr.detectChanges();
  }

  public showMapToggle(): void {
    this.showMap = true;
    const map = this.map;
    if (map) {
      map.nativeElement.style.width = '600px';
      map.nativeElement.style.height = '600px';
      map.nativeElement.style.position = 'static';
      if (this.mapContent) {
        this.mapContent.nativeElement.append(map.nativeElement);
        this.yaMap.yaMapRedraw();
      }
    }
    this.cdr.detectChanges();
  }

  public visibleChange(): void {
    this.cdr.detectChanges();
  }
}
