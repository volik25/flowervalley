import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ClientService } from '../../../../_services/back/client.service';
import { isFormInvalid } from '../../../../_utils/formValidCheck';
import { Router } from '@angular/router';
import { MainBanner } from '../../../../_models/main-banner';

@Component({
  selector: 'flower-valley-clients',
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.scss'],
})
export class ClientsComponent {
  public clientGroup: FormGroup;
  public isLoading: boolean = false;
  private addedPhotos: File[] = [];
  private deleteIds: number[] = [];
  public currentPhotos: { id: number; src: string }[] = [];
  constructor(
    private fb: FormBuilder,
    private clientService: ClientService,
    private router: Router,
  ) {
    this.clientGroup = fb.group({
      autoPlay: [null, Validators.required],
      isUserCanLeaf: [false, Validators.required],
    });
    const data = sessionStorage.getItem('clients');
    if (data) {
      const clients: MainBanner<unknown> = JSON.parse(data);
      this.clientGroup.patchValue(clients);
      this.currentPhotos = clients.photos;
    }
  }

  public editClient(): void {
    if (isFormInvalid(this.clientGroup)) return;
    this.isLoading = true;
    const review = this.clientGroup.getRawValue();
    const formData = new FormData();
    this.addedPhotos.map((photo) => {
      formData.append('photos[]', photo);
    });
    this.deleteIds.map((id) => {
      formData.append('deleteIds[]', id.toString());
    });
    formData.append('autoPlay', review.autoPlay);
    formData.append('isUserCanLeaf', review.isUserCanLeaf);
    this.clientService.addItem(formData).subscribe(() => {
      this.isLoading = false;
      sessionStorage.removeItem('clients');
      this.router.navigate(['']);
    });
  }

  public filesUploaded(photos: File[]) {
    this.addedPhotos = photos;
  }

  public removePhoto(id: number): void {
    this.deleteIds.push(id);
    const i = this.currentPhotos.findIndex((photo) => photo.id === id);
    this.currentPhotos.splice(i, 1);
  }
}
