import { Component, Input } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { MenubarModule } from 'primeng/menubar';
import { MenuModule } from 'primeng/menu';
import { AuthService } from '../../auth/services/auth.service';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { InputNumberModule } from 'primeng/inputnumber';
import { DialogModule } from 'primeng/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'user-navigation',
  imports: [
    MenubarModule,
    MenuModule,
    CommonModule,
    MenubarModule,
    ButtonModule,
    InputTextModule,
    PasswordModule,
    InputNumberModule,
    DialogModule,
    ReactiveFormsModule,
  ],
  standalone: true,
  templateUrl: './user-navigation.component.html',
  styleUrls: ['./user-navigation.component.css'],
})
export class UserNavigationComponent {
  displayDialog: boolean = false;
  configForm: FormGroup; // FormGroup;
  constructor(private authService: AuthService, private fb: FormBuilder, private router: Router) {
    this.configForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      identificationNumber: [null, Validators.required],
      password: [''],
    });
  }

  @Input() balance: number = 0; // User balance

  items: MenuItem[] = [
    {
      label: 'Perfil',
      icon: 'pi pi-user',
      items: [
        {
          label: 'Configuración',
          icon: 'pi pi-cog',
          command: () => this.mostrarModal(),
        },
        {
          label: 'Cerrar sesión',
          icon: 'pi pi-sign-out',
          command: () => this.logout(),
        },
      ],
    },
    {
      label: 'Histórico de pagos',
      icon: 'pi pi-clock',
      command: () => {this.router.navigate(['/user/payment-record'])}
    },
  ];

  mostrarModal() {
    this.displayDialog = true;
  }

  logout() {
    this.authService.logout().subscribe({
      next: () => {
        console.log('Logout successful');
      },
      error: (error) => {
        console.error('Logout error:', error);
      },
    });
  }
}
