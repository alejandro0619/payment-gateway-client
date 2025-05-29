import {
  Component,
  HostListener,
  inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { MenuItem } from 'primeng/api';
import { Router } from '@angular/router';
import { DrawerModule } from 'primeng/drawer';
import { ButtonModule } from 'primeng/button';
import { Ripple } from 'primeng/ripple';
import { AvatarModule } from 'primeng/avatar';
import { CreateCourseComponent } from '../../../app/admin/courses/create-course.component';
import { CoursesService } from '../../../app/admin/courses/courses.service';
import { AuthService } from '../../../app/auth/services/auth.service';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { InputNumberModule } from 'primeng/inputnumber';
import { DialogModule } from 'primeng/dialog';
import {
  ReactiveFormsModule,
  FormGroup,
  FormBuilder,
  Validators,
} from '@angular/forms';
import { Company } from '../../global.types';
import { AdminService } from './main-menu.service';
import { User } from '../../global.types';
import { MessageService } from 'primeng/api';
import { Roles } from '../../global.types';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'main-menu',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    BreadcrumbModule,
    DrawerModule,
    ButtonModule,
    Ripple,
    AvatarModule,
    CreateCourseComponent,
    InputTextModule,
    PasswordModule,
    InputNumberModule,
    DialogModule,
    ReactiveFormsModule,
  ],
  templateUrl: './main-menu.component.html',
})
// CHECK FOR USEFFECT HOOK ANGULAR'S VERSION
export class MainMenu implements OnInit {
  @ViewChild('createCourseModal') createCourseModal!: CreateCourseComponent;
  private toastr = inject(ToastrService);
  displayDialog: boolean = false;
  configForm: FormGroup;

  courses: any[] = [];
  visible: boolean = false;
  coursesVisible: boolean = false;
  transactionsVisible = false;
  employeesVisible = false;
  showCourses: boolean = false;
  company: Company | null = null;
  items: MenuItem[] = [];
  home: MenuItem = { icon: 'pi pi-home', routerLink: '/' };

  admins: User[] = [];
  loading: boolean = true;
  totalRecords: number = 0;
  selectedAdmin: User | null = null;
  selectedFilter: string = 'user.identificationNumber';
  searchText: string = '';
  filteredAdmins: User[] = [];
  currentUserId: string | null = null;
  isDisabled: boolean = true; 
  isLoading: boolean = false;
  
  constructor(
    private router: Router,
    private coursesService: CoursesService,
    private authService: AuthService,
    private fb: FormBuilder,
    private adminService: AdminService
  ) {
    this.currentUserId = this.authService.getCurrentUserId();
    const companyStr = localStorage.getItem('company');
    this.company = companyStr ? JSON.parse(companyStr) : null; // ??
    this.configForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      identificationNumber: [null, Validators.required],
      password: [''],
    });
  }

  ngOnInit() {
    this.loadCourses();
    this.getAdmins();

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

  getAdmins() {
    this.adminService.getAdmins().subscribe(
      (data: User[]) => {
        this.admins = data;
        this.totalRecords = data.length;
        this.filteredAdmins = [...data];
        this.loading = false;
        console.log('Administradores obtenidos:', this.admins);
      },
      (error) => {
        console.error('Error fetching admins:', error);
        this.loading = false;
      }
    );
  }

  showAdminDetails(admin: User) {
    // Verificar si el admin seleccionado es el usuario actual
    if (admin.id !== this.currentUserId) {
      this.toastr.warning('Solo puedes editar tu propia información');
      return;
    }

    this.selectedAdmin = admin;
    this.configForm.patchValue({
      firstName: admin.firstName,
      lastName: admin.lastName,
      identificationNumber: parseInt(admin.identificationNumber, 10),
      email: admin.email,
      password: '',
    });
    this.displayDialog = true;
  }
  showCurrentUserDetails() {
    const currentUser = this.admins.find(
      (admin) => admin.id === this.currentUserId
    );
    if (currentUser) {
      this.showAdminDetails(currentUser);
    }
  }

  updateAdmin() {
    if (this.configForm.invalid || !this.selectedAdmin) return;

    const formData = {
      ...this.prepareUpdateData(),
      id: this.selectedAdmin.id,
    };
    this.isLoading = true;

    this.adminService.updateAdmin(formData).subscribe({
      next: (updatedUser) => {
        this.updateLocalData(updatedUser);
        this.displayDialog = false;
        this.toastr.success('Administrador actualizado exitosamente');
        this.getAdmins();
        this.isLoading = false;
      },
      error: (error) => {
        this.toastr.error('Error actualizando administrador', error.message);
        console.error('Error actualizando administrador:', error);
        this.isLoading = false;
      },
    });
  }

  private prepareUpdateData(): any {
    const data: any = { ...this.configForm.value };

    // Limpiar datos no modificados
    if (!data.password) delete data.password;
    data.identificationNumber = data.identificationNumber.toString();
    data.role = 'admin' as Roles.ADMIN; // Cambiado a rol admin
    return data;
  }

  private updateLocalData(updatedUser: User) {
    const index = this.admins.findIndex((u) => u.id === updatedUser.id);
    if (index > -1) {
      this.admins[index] = updatedUser;
      this.admins = [...this.admins]; // Forzar detección de cambios
    }
  }

  get f() {
    return this.configForm.controls;
  }

  private prepareAdminUpdateData(): any {
    const data = { ...this.configForm.value };

    if (!data.password) delete data.password;
    data.identificationNumber = data.identificationNumber.toString();
    return data;
  }

  goToSignupAdmin() {
    console.log('Navigating to signup admin...');
    this.router.navigate(['auth/signup-admin']);
  }
  goToDashboard() {
    console.log('Navigating to dashboard...');
    this.router.navigate(['admin/dashboard']);
  }
  goToSignUpOperator() {
    console.log('Navigating to signUp-Operator...');
    this.router.navigate(['auth/signup-operator']);
  }
  goToShowCourses() {
    console.log('Navigating to Courses...');
    this.router.navigate(['admin/courses']);
  }
  goToTransactions() {
    console.log('Navigating to Transactions...');
    this.router.navigate(['admin/transactions']);
  }
  goToEmployees() {
    console.log('Navigating to Employees...');
    this.router.navigate(['admin/employees']);
  }
  // ? ney?
  goToSettings() {
    console.log('Navigating to Settings...');
    this.router.navigate(['admin/students']);
  }
  loadCourses() {
    this.coursesService.getCourses().subscribe({
      next: (courses) => {
        this.courses = courses.map((course) => ({
          ...course,
          price: parseFloat(course.price).toFixed(2),
          createdAt: new Date(course.createdAt),
        }));
        console.log('Courses loaded:', this.courses);
      },
      error: (error) => {
        console.error('Error loading courses:', error);
      },
    });
  }
  showModal() {
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
  openCreateCourseModal() {
    this.createCourseModal.openModal();
  }

  closeCallback(event: Event) {
    this.visible = false;
  }

  capitalize(text: string): string {
    return text.charAt(0).toUpperCase() + text.slice(1);
  }
}
