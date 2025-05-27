import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormControl, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ReactiveFormsModule } from '@angular/forms';
import { Roles } from '../../global.types';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-signup-admin',
  imports: [ ReactiveFormsModule,CommonModule, ButtonModule],
  providers: [AuthService],
  standalone: true,
  templateUrl: './signup-admin.component.html',
  
})
export class SignupAdminComponent {
  @Input() fragment: string = 'signup-admin'; // This fragment is used to scroll to the form when the user clicks on the link in the login page
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
      this.isLoading = true;
      
      this.authService.signupAdmin({
        name: name as string,
        firstName: name as string,
        lastName: lastName as string,
        email: email as string,
        identificationNumber: identificationNumber as string,
        password: this.form.get('password')?.value as string,
        role: Roles.ADMIN

      }, this.fragment).subscribe({
        next: (response: any) => {
          console.log('Registro exitoso:', response);
          this.toastr.success('¡Registro exitoso!', 'Bienvenido');
          if (this.fragment === 'signup-admin') {
            this.toastr.info('Administrador registrado', 'Información');
            this.router.navigate(['/admin/dashboard']);
          } else {
            this.toastr.info('Usuario registrado', 'Información');
            this.router.navigate(['/onboarding/step-two']);
          }
          
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
