import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';
import { LoginResponse } from '../auth.types';

@Component({
  selector: 'app-login',
  imports: [CommonModule],
  providers: [AuthService],
  templateUrl: './login.component.html',

})
export class LoginComponent  {

  id = "";
  password = "";
  errorMessage = "";

  private authService: AuthService = inject(AuthService);
  loginResponse: LoginResponse | null = null;

  onSubmit() {
    if(!this.id || !this.password) {
      this.errorMessage = "Por favor, completa los campos";
      return;
    }

    this.authService.login(this.id, this.password).subscribe({
      next: (res) => {
        this.loginResponse = res;
      },
      error: (err) => {
        this.errorMessage = "Error al iniciar sesión";
        console.error(err);
      }
    });
  }
}
