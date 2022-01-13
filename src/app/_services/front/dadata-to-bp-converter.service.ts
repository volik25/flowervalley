import { Injectable } from '@angular/core';
import { DaDataEntity } from '../../_models/daDataEntity';
import { Firm } from '../../_models/business-pack/firm';

@Injectable({
  providedIn: 'root',
})
export class DadataToBpConverterService {
  public convertToFirm(entity: DaDataEntity): Firm {
    return <Firm>{
      FullName: entity.data.name.full_with_opf,
      ShortName: entity.data.name.short_with_opf,
      Address: entity.data.address.unrestricted_value,
      INN: entity.data.inn,
      KPP: entity.data.kpp,
    };
  }
}
