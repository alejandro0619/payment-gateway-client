import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormControl, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ReactiveFormsModule } from '@angular/forms';
import { Roles } from '../../global.types';

@Component({
  selector: 'app-signup-admin',
  imports: [ ReactiveFormsModule,CommonModule],
  providers: [AuthService],
  templateUrl: './signup-admin.component.html',
  
})
export class SignupAdminComponent {
private toastr = inject(ToastrService); 
  private router: Router = inject(Router);
  private authService = inject(AuthService);

  form = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(3)]),
    lastName: new FormControl('', [Validators.required, Validators.minLength(3)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(8)]),
    identificationNumber: new FormControl('', [Validators.required, Validators.minLength(8), Validators.maxLength(9)]),
    confirmPassword: new FormControl('', [Validators.required]),
  }, { validators: this.passwordsMatchValidator() }); 

  errorMessage: string | null = null;
  isLoading = false;


  passwordsMatchValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const formGroup = control as FormGroup; 
      const password = formGroup.get('password')?.value;
      const confirmPassword = formGroup.get('confirmPassword')?.value;
      return password === confirmPassword ? null : { passwordsMismatch: true };
    };
  }

  submit() {
    if (this.form.valid) {
      const { name, lastName, email, identificationNumber } = this.form.value;
      
      this.authService.signupAdmin({
        name: name as string,
        firstName: name as string,
        lastName: lastName as string,
        email: email as string,
        identificationNumber: identificationNumber as string,
        password: this.form.get('password')?.value as string,
        role: Roles.ADMIN

      }).subscribe({
        next: (response: any) => {
          console.log('Registro exitoso:', response);
          this.toastr.success('¡Registro exitoso!', 'Bienvenido');
          this.router.navigate(['/auth/login']);
        },
        error: (error: any) => {
          console.error('Error en el registro:', error);
          this.toastr.error('Error en el registro', 'Por favor, verifica los datos.');
        },
        complete: () => {
          this.isLoading = false;
        }
      });
;

    } else {
      console.log('Form is invalid');
      this.toastr.error('Error en el registro', 'Por favor, verifica los datos.');

    }
  }

}
