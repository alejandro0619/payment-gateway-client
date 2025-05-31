import { Component, inject, Input } from '@angular/core';
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
import { ActivatedRoute, Router } from '@angular/router';

import { User, Roles, Company } from '../../global.types';
import { UserService } from './user-navigation.service';
import { ToastrService } from 'ngx-toastr';
import { RedirectDashboardGuard } from '../../../core/redirect-dashboard';
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
  private toastr = inject(ToastrService);
  displayDialog: boolean = false;
  configForm: FormGroup; // FormGroup;

  users: User[] = [];
  loading: boolean = true;
  totalRecords: number = 0;
  selectedUser: User | null = null;
  selectedFilter: string = 'user.identificationNumber';
  searchText: string = '';
  filteredAdmins: User[] = [];
  currentUserId: string | null = null;
  isDisabled: boolean = true;
  isLoading: boolean = false;
  company: Company | null = null;


  constructor(private authService: AuthService, private fb: FormBuilder, private router: Router, private userService: UserService, private route: ActivatedRoute, private redirectService: RedirectDashboardGuard) {
    this.currentUserId = this.authService.getCurrentUserId();

    this.configForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
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
          command: () => this.showCurrentUserDetails(),
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
      command: () => { this.router.navigate(['/user/payment-record']) }
    },
  ];



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

  redirectToDashboard() {
    this.redirectService.redirectToDashboard();
  }
  ngOnInit() {
    this.getUsers();

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


  getUsers() {
    this.userService.getUsers().subscribe(
      (data: User[]) => {
        this.users = data;
        this.totalRecords = data.length;
        this.filteredAdmins = [...data];
        this.loading = false;
        console.log('Users obtenidos:', this.users);
      },
      (error) => {
        console.error('Error fetching users:', error);
        this.loading = false;
      }
    );
  }

  showUserDetails(user: User) {
    if (user.id !== this.currentUserId) {
      this.toastr.warning('Solo puedes editar tu propia información');
      return;
    }
    this.selectedUser = user;
    this.configForm.patchValue({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      password: '',
    });
    this.displayDialog = true;
  }

  showCurrentUserDetails() {
    const currentUserId = this.authService.getCurrentUserId();
    const currentUser = this.users.find(u => u.id === currentUserId);
    if (currentUser) {
      this.showUserDetails(currentUser);
    } else {
      this.toastr.error('No se encontró el usuario actual en la lista');
    }
  }

  updateUser() {
    if (this.configForm.invalid || !this.selectedUser) return;

    const formData = {
      ...this.prepareUpdateData(),
      id: this.selectedUser.id,
    };

    this.userService.updateUser(formData).subscribe({
      next: (updatedUser) => {
        this.updateLocalData(updatedUser);
        this.displayDialog = false;
        this.toastr.success('Usuario actualizado exitosamente');
        this.getUsers();
      },
      error: (error) => {
        if (error.status === 401) {
          this.toastr.error('Sesión expirada', 'Por favor, inicia sesión nuevamente.');
          this.authService.logout(); // Cierra sesión
          this.router.navigate(['/login']); // Redirige al login
        } else {
          this.toastr.error('Error actualizando usuario', error.message);
        }
      },
    });
  }

  private prepareUpdateData(): any {
    const data: any = { ...this.configForm.value };

    // Limpiar datos no modificados
    if (!data.password) delete data.password;
    return data;
  }

  private updateLocalData(updatedUser: User) {
    const index = this.users.findIndex((u) => u.id === updatedUser.id);
    if (index > -1) {
      this.users[index] = updatedUser;
      this.users = [...this.users]; // Forzar detección de cambios
    }
  }

  get f() {
    return this.configForm.controls;
  }

}
