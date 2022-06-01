import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { BusinessPackService } from '../../_services/back/business-paсk.service';
import { Firm } from '../../_models/business-pack/firm';
import { take } from 'rxjs/operators';
import { DadataService } from '../../_services/back/dadata.service';
import { DaDataEntity } from '../../_models/daDataEntity';
import { DadataToBpConverterService } from '../../_services/front/dadata-to-bp-converter.service';
import { AutoComplete } from 'primeng/autocomplete';

@Component({
  selector: 'flower-valley-entity-form',
  templateUrl: './entity-form.component.html',
  styleUrls: ['./entity-form.component.scss'],
})
export class EntityFormComponent implements OnInit, OnChanges {
  @ViewChild('autoCompleteInn')
  public autocompleteInn: AutoComplete | undefined;
  @Input()
  public newClientLabel: string = 'Я делаю заказ впервые';
  @Input()
  public isNewOrder: boolean = false;
  @Input()
  public client: Firm | undefined;
  public entityId: string | undefined;
  public entityData: FormGroup;
  public isNewClient: FormControl;
  public isShowForm: boolean = false;
  private entityDataChanged: boolean = false;
  @Output()
  private dataChanges: EventEmitter<FormGroup | { id: string; isChanged: boolean }> =
    new EventEmitter<FormGroup | { id: string; isChanged: boolean }>();
  public businessPackResults: Firm[] = [];
  public daDataResults: DaDataEntity[] = [];

  constructor(
    private fb: FormBuilder,
    private bpService: BusinessPackService,
    private dadataService: DadataService,
    private dadataConvertService: DadataToBpConverterService,
  ) {
    this.entityData = fb.group({
      FullName: ['', Validators.required],
      INN: ['', Validators.required],
      ShortName: ['', Validators.required],
      Address: ['', Validators.required],
      NoNDS: [false, Validators.required],
      BIK: ['', Validators.required],
      Bank: ['', Validators.required],
      CorDep: ['', Validators.required],
      RasDep: ['', Validators.required],
      KPP: [''],
      OKPO: [''],
      ExtraName: [''],
      PersonalDep: [''],
      OrgEMail: [''],
      OrgPhone: [''],
      OrgURL: [''],
    });
    this.entityData.valueChanges.subscribe(() => {
      if (this.isNewClient.value === true) {
        this.dataChanges.emit(this.entityData);
      } else {
        this.dataChanges.emit({
          id: this.entityId || '',
          isChanged: this.entityDataChanged,
        });
        if (this.entityDataChanged) this.dataChanges.emit(this.entityData);
      }
    });
    this.isNewClient = this.fb.control(false);
    this.isNewClient.valueChanges.subscribe(() => {
      this.entityData.reset({ NoNDS: false });
      this.entityDataChanged = false;
      this.isShowForm = false;
    });
  }

  public ngOnInit(): void {
    this.dataChanges.emit(this.entityData);
  }

  public ngOnChanges(changes: SimpleChanges) {
    const client: Firm = changes['client'].currentValue;
    if (client) {
      this.autocompleteInn?.selectItem(client);
    }
  }

  public patchBpValue(selectedFirm: Firm): void {
    this.entityId = selectedFirm.Object;
    this.entityData.patchValue(selectedFirm);
    this.isShowForm = true;
    this.entityData.valueChanges.pipe(take(1)).subscribe(() => {
      this.entityDataChanged = true;
    });
  }

  public patchDaDataValue(selectedFirm: DaDataEntity): void {
    const firm = this.dadataConvertService.convertToFirm(selectedFirm);
    this.entityData.patchValue(firm);
    this.isShowForm = true;
  }

  public searchItemsByBP(searchString: string): void {
    this.bpService.searchFirm(searchString).subscribe(({ items }) => {
      this.businessPackResults = items.filter((item) => item.INN);
    });
  }

  public searchItemsByDaData(searchString: string): void {
    this.dadataService.getFirmByINN(searchString).subscribe(({ suggestions }) => {
      this.daDataResults = suggestions;
    });
  }
}
