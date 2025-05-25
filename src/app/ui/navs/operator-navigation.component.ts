import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { MenubarModule } from 'primeng/menubar';
import { MenuModule } from 'primeng/menu';
import { AuthService } from '../../auth/services/auth.service';

import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { PanelMenuModule } from 'primeng/panelmenu';
import { SplitterModule } from 'primeng/splitter';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { InputNumberModule } from 'primeng/inputnumber';
import { DialogModule } from 'primeng/dialog';
import { FieldsetModule } from 'primeng/fieldset';
import { PanelModule } from 'primeng/panel';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

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
  currentUser: any; // Variable para almacenar los datos del usuario

  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.configForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      identificationNumber: [null, Validators.required],
      password: ['']
    });
  }

  ngOnInit() {

  }

  items: MenuItem[] = [
    {
      label: 'Perfil',
      icon: 'pi pi-user',
      items: [
        {
          label: 'Configuración',
          icon: 'pi pi-cog',
          command: () => this.mostrarModal()
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
      command: () => {this.router.navigate(['/operator/dashboard'])}
    },
    {
      label: 'Histórico de pagos',
      icon: 'pi pi-clock',
      command: () => {this.router.navigate(['/operator/payment-record'])}
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
      }
    });
  }
}