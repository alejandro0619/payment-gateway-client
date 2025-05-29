import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { MenubarModule } from 'primeng/menubar';

import { AuthService } from '../../auth/services/auth.service';

import { ButtonModule } from 'primeng/button';

import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { InputNumberModule } from 'primeng/inputnumber';
import { DialogModule } from 'primeng/dialog';

import { Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UserService } from './user-navigation.service';
import { User } from '../../auth/auth.types';
import { Company } from '../../global.types';

@Component({
  selector: 'operator-navigation',
  standalone: true,
  imports: [
    CommonModule,
    MenubarModule,
    ButtonModule,
    InputTextModule,
    PasswordModule,
    InputNumberModule,
    DialogModule,
    ReactiveFormsModule
  ],
  templateUrl: './operator-navigation.component.html'
})
export class OperatorNavigationComponent implements OnInit {
  displayDialog: boolean = false;
  configForm: FormGroup;
  currentUser: User | null = null;
  company: Company | null = null;
  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private router: Router,
    private service: UserService
  ) {
    this.configForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      password: ['']
    });
  }

  ngOnInit() {
    this.company = localStorage.getItem('company') ? JSON.parse(localStorage.getItem('company')!) : null;
    this.currentUser = this.authService.getCurrentUser();

    // This might have some overhead, but it ensures that the company data is always up-to-date.
    // One day I might want to use a more efficient way to handle this, like using a service with BehaviorSubject.
    setInterval(() => {
      const companyStr = localStorage.getItem('company');
      const parsedCompany = companyStr ? JSON.parse(companyStr) : null;

      if (JSON.stringify(this.company) !== JSON.stringify(parsedCompany)) {
        this.company = parsedCompany;
      }
    }, 1000);
  }

  items: MenuItem[] = [
    {
      label: 'Perfil',
      icon: 'pi pi-user',
      items: [
        {
          label: 'Configuración',
          icon: 'pi pi-cog',
          command: () => this.showModal()
        },
        {
          label: 'Cerrar sesión',
          icon: 'pi pi-sign-out',
          command: () => this.logout()
        }
      ]
    },
    {
      label: 'Página principal',
      icon: 'pi pi-fw pi-home',
      command: () => { this.router.navigate(['/operator/dashboard']) }
    },
    {
      label: 'Histórico de pagos',
      icon: 'pi pi-clock',
      command: () => { this.router.navigate(['/operator/payment-record']) }
    },
  ];

  showModal() {
    this.displayDialog = true;
  }

  updateOperator() {
    if (this.configForm.valid) {
      const updatedUser = {
        id: this.currentUser!.id,
        ...this.configForm.value
      };

      console.log('Updating user:', updatedUser);
      this.service.updateUser(updatedUser).subscribe({
        next: (response) => {
          console.log('User updated successfully:', response);
          this.displayDialog = false;
          this.router.navigate(['/operator/dashboard']);
        },
        error: (error) => {
          console.error('Error updating user:', error);
        }
      });
    } else {
      console.error('Form is invalid');
    }
  }

  logout() {
    this.authService.logout().subscribe({
      next: () => {
        console.log('Logout successful');
      },
      error: (error) => {
        console.error('Logout error:', error);
      }
    });
  }
}