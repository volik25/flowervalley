import { ElementRef, Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { greenPolygon, moscowPolygon, yellowPolygon } from '../../_utils/ya_map_data';

declare var ymaps: any;

@Injectable()
export class YaMapService {
  private flowerValleyMap: any;
  private searchBounds: any;
  private polygons: any;
  private route: any;
  private point: any;
  private isFinished: boolean = false;

  private calculationUpdate: Subject<number> = new Subject<number>();
  public addressChanged: Subject<string> = new Subject<string>();

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
    this.isFinished = false;
    if (this.route) {
      this.flowerValleyMap.geoObjects.remove(this.route);
      this.route = undefined;
    }
    if (this.point) {
      this.flowerValleyMap.geoObjects.remove(this.point);
      this.point = undefined;
    }
    const geocoder = new ymaps.geocode(address, {
      boundedBy: this.searchBounds,
      strictBounds: true,
    });
    geocoder.then((res: any) => {
      if (res.geoObjects.getLength()) {
        const point = res.geoObjects.get(0);
        for (let i = 0; i < this.polygons.length; i++) {
          const polygon = this.polygons[i];
          if (polygon.geometry.contains(point.geometry.getCoordinates())) {
            this.point = point;
            this.flowerValleyMap.geoObjects.add(point);
            const basePrice = Number(polygon.properties.get('description'));
            this.calculationUpdate.next(basePrice);
            this.isFinished = true;
            break;
          }
        }
        if (!this.isFinished) {
          const routes: any[] = [];
          for (let i = 0; i < this.polygons.length; i++) {
            const polygon = this.polygons[i];
            const from = polygon.geometry.getClosest(point.geometry.getCoordinates());
            const router = new ymaps.route([
              polygon.geometry.getCoordinates()[0][from.closestPointIndex],
              address,
            ]);
            router.then((route: any) => {
              routes.push(route);
              if (routes.length === 3) {
                const minRoute = YaMapService.minRoute(routes);
                this.flowerValleyMap.geoObjects.add(minRoute);
                this.route = minRoute;
                const shippingCost = Math.ceil(minRoute.getLength() / 1000);
                const basePrice = Number(polygon.properties.get('description'));
                this.calculationUpdate.next(shippingCost * 50 + basePrice);
              }
            });
          }
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
    this.polygons = [
      new ymaps.GeoObject(moscowPolygon, { ...moscowPolygon.options }),
      new ymaps.GeoObject(greenPolygon, { ...greenPolygon.options }),
      new ymaps.GeoObject(yellowPolygon, { ...yellowPolygon.options }),
    ];
    this.polygons.map((polygon: any) => {
      this.flowerValleyMap.geoObjects.add(polygon);
    });
  }

  public yaMapRedraw(): void {
    this.flowerValleyMap.container.fitToViewport();
  }

  private static minRoute(array: any[]): any {
    let minRoute = array[0];
    let min = minRoute.getLength();
    for (let i = 1; i < array.length; i++) {
      const current = array[i].getLength();
      if (current < min) minRoute = array[i];
    }
    return minRoute;
  }
}
