import { Component, inject, signal } from '@angular/core';
import { CommonModule, JsonPipe } from '@angular/common';
import { AuthService } from '../services/auth.service';
import { SignInResponse } from '../auth.types';
import { FormGroup, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  providers: [AuthService],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  private toastr = inject(ToastrService);
  private authService: AuthService = inject(AuthService);
  private router: Router = inject(Router);
  loginResponse: SignInResponse | null = null;
  errorMessage: string | null = null;
  isLoading = false;

  form = signal(
    new FormGroup({
      id: new FormControl('', [Validators.required, Validators.minLength(8), Validators.maxLength(9)]),
      password: new FormControl('', [Validators.required]),
    })
  );

  async onSubmit() {
    if (this.form().invalid) {
      this.errorMessage = 'Por favor completa todos los campos correctamente.';
      return;
    }

    this.errorMessage = null;
    this.isLoading = true;
    const { id, password } = this.form().value;

    try {
      this.authService.signIn(id as string, password as string).subscribe({
        next: (response: SignInResponse) => {
          this.loginResponse = response;
          this.toastr.success('¡Registro exitoso!', 'Bienvenido');
          this.router.navigate(['/auth/onboarding']);
        },
        error: (error: any) => {
          this.errorMessage = 'Error al iniciar sesión. Verifica tus credenciales.';
          this.toastr.error('Error en el registro', 'Por favor, verifica los datos.');
        },

        complete: () => {
          this.isLoading = false;
        }
      });


    } catch (error) {
      this.errorMessage = 'Error al iniciar sesión. Ha ocurrido un error inesperado.';
      this.toastr.error('Error en el registro', 'Por favor, verifica los datos.');
    }
  }
}
