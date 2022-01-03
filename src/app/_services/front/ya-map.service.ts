import { ElementRef, Injectable } from '@angular/core';
import { MkadPolygon } from '../../_utils/mkad-polygon';
import { Observable, Subject } from 'rxjs';
import { OrderConfirmationComponent } from '../../modules/cart/order-confirmation/order-confirmation.component';

declare var ymaps: any;

@Injectable()
export class YaMapService {
  private mkad_km = MkadPolygon;
  private flowerValleyMap: any;
  private searchBounds: any;
  private polygon: any;
  private route: any;

  private calculationUpdate: Subject<number> = new Subject<number>();
  public addressChanged: Subject<string> = new Subject<string>();

  public orderConfirmationComponent: OrderConfirmationComponent | undefined;

  constructor(private _element: ElementRef<HTMLElement>) {
    ymaps.ready(() => {
      this.setMapConfig();
    });
    this.addressChanged.subscribe((address) => {
      this.requestToYandexGeocoder(address);
    });
  }

  public calculateShippingCost(): Observable<number> {
    return this.calculationUpdate.asObservable();
  }

  private requestToYandexGeocoder(address: string): void {
    if (this.route) this.flowerValleyMap.geoObjects.remove(this.route);
    const geocoder = new ymaps.geocode(address, {
      boundedBy: this.searchBounds,
      strictBounds: true,
    });
    geocoder.then((res: any) => {
      if (res.geoObjects.getLength()) {
        const point = res.geoObjects.get(0);
        if (this.polygon.geometry.contains(point.geometry.getCoordinates())) {
          this.calculationUpdate.next(2500);
        } else {
          const from = this.polygon.geometry.getClosest(point.geometry.getCoordinates());
          const router = new ymaps.route([this.mkad_km[from.closestPointIndex], address]);
          router.then((route: any) => {
            this.route = route;
            this.flowerValleyMap.geoObjects.add(route);
            const shippingCost = Math.ceil(route.getLength() / 1000);
            this.calculationUpdate.next(shippingCost);
          });
        }
      } else {
        this.calculationUpdate.next(0);
      }
    });
  }

  private setMapConfig(): void {
    this.flowerValleyMap = new ymaps.Map('yaMap', {
      center: [37.622093, 55.753994],
      zoom: 9,
    });
    this.searchBounds = [
      [36.725552, 56.334356],
      [38.604214, 55.296747],
    ];
    this.polygon = new ymaps.Polygon([this.mkad_km]);
    this.flowerValleyMap.geoObjects.add(this.polygon);
  }

  public yaMapRedraw(): void {
    this.flowerValleyMap.container.fitToViewport();
  }
}
