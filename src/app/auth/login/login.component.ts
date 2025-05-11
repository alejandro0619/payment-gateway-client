import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';
import { SignInResponse } from '../auth.types';
import { FormGroup, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { RedirectService } from '../services/redirect.service';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ButtonModule],
  providers: [AuthService, RedirectService],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  private toastr = inject(ToastrService);
  private authService: AuthService = inject(AuthService);
  private redirectService: RedirectService = inject(RedirectService);

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
          console.log(response.user)
          this.toastr.success('¡Registro exitoso!', 'Bienvenido a la plataforma.');
          this.toastr.info('Redirigiendo...', 'Por favor, espera un momento.');
          localStorage.setItem('usr_info', response.user.id);
          this.router.navigate([this.redirectService.redirect(response.user.role)]);
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
