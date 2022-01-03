import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AdminService } from '../../_services/back/admin.service';

@Component({
  selector: 'flower-valley-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss'],
})
export class SignInComponent {
  public passwordForm: FormGroup;
  public isAdmin: boolean = false;

  constructor(private fb: FormBuilder, private adminService: AdminService) {
    adminService.checkAdmin().subscribe((isAdmin) => {
      this.isAdmin = isAdmin;
    });
    this.passwordForm = fb.group({
      password: ['', Validators.required],
    });
  }

  public signIn(): void {
    if (this.passwordForm.invalid) return;
    const password = this.passwordForm.getRawValue();
    this.adminService.signIn(password).subscribe(() => {});
  }

  public signOut(): void {
    this.adminService.logOut().subscribe();
  }
}
