import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { DrawerModule } from 'primeng/drawer';
import { ButtonModule } from 'primeng/button';
import { AvatarModule } from 'primeng/avatar';
import { MessageService } from 'primeng/api';
import { CardModule } from 'primeng/card';
import { DashboardService } from './dashboard.service';
import { Course, CreateTRXResponse, UserCoursesFeed } from '../global.types';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { PanelModule } from 'primeng/panel';
import { TagModule } from 'primeng/tag';
import { DividerModule } from 'primeng/divider';
import { paypalBtn } from '../ui/global/paypal-button.component';
import { ToastModule } from 'primeng/toast';
import { MessageModule } from 'primeng/message';
import { DialogModule } from 'primeng/dialog';
import { CalendarModule } from 'primeng/calendar';
import { FileUploadModule } from 'primeng/fileupload';
import { InputTextModule } from 'primeng/inputtext';
import { UserNavigationComponent } from '../ui/navs/user-navigation.component';
@Component({
  selector: 'app-dashboard',
  imports: [
    CommonModule,
    BreadcrumbModule,
    DrawerModule,
    ButtonModule,
    AvatarModule,
    CardModule,
    ProgressSpinnerModule,
    PanelModule,
    TagModule,
    DividerModule,
    paypalBtn,
    ToastModule,
    MessageModule,
    DialogModule,
    CalendarModule,
    FileUploadModule,
    InputTextModule,
    UserNavigationComponent
  ],
  templateUrl: './dashboard.component.html',
  providers: [MessageService],
  standalone: true,
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  courses: UserCoursesFeed | null = null;
  loading: boolean = true;
  width: any;
  showZelleInformation: boolean = false;
  transferDate: Date | null = null; // Fecha de transferencia
  maxDate: Date = new Date(); // Fecha máxima = hoy
  objectKeys = Object.keys;
  selectedCourse: Course | null = null;
  selectedCourseStatus: string = '';

  // This is relevant for the drawer component
  drawerVisible: boolean = false;
  drawerPosition: 'left' | 'right' = 'left';
  createdTRX: CreateTRXResponse | null = null;
  paymentMethod: 'paypal' | 'zelle' = 'paypal';


  constructor(
    private dashboardService: DashboardService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.loadCourses();
  }

  closeDetails(): void {
    this.selectedCourse = null;
    this.createdTRX = null;
    this.paymentMethod = 'paypal';

  }
  getStatusTitle(status: string): string {
    const titles = {
      'acquired': 'Adquirido',
      'not_acquired': 'No Adquirido',
      'cancelled': 'Cancelado',
      'expired': 'Expirado',
      'not_bought': 'Disponible'
    };
    return titles[status as keyof typeof titles] || status;
  }
  createOrder() {
    this.dashboardService.createOrder(this.createdTRX!.transactionId).subscribe({
      next: (response) => {
        console.log('Orden creada:', response);
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Orden creada con éxito'
        });
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo crear la orden'
        });
      }
    });
  }

  setSelectedCourse(course: Course, status: string): void {
    this.closeDetails(); // Close any previous details
    this.selectedCourse = course;
    this.selectedCourseStatus = status;
    this.drawerVisible = true;
  }
  getCourseProperty<T extends keyof Course>(prop: T) {
    if (!this.selectedCourse) {
      return null;
    }
    if (this.selectedCourseStatus === 'not_bought') {
      return this.selectedCourse[prop];
    }
    return this.selectedCourse.course?.[prop];
  }
  
  private loadCourses(): void {
    // Get userId from localStorage
    const userId: string = localStorage.getItem("usr_info")!; // Should always exist, since the user is logged in
    this.dashboardService.getUserCoursesFeed(userId).subscribe({
      next: (courses) => {
        this.courses = courses;
        this.loading = false;
        console.log('Cursos cargados:', this.courses);
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudieron cargar los cursos'
        });
        this.loading = false;
      }
    });
  }

  createTransaction(courseId: string, paymentMethod: 'paypal' | 'zelle') {
    const userId: string = localStorage.getItem("usr_info")!; // Should always exist, since the user is logged in

    this.dashboardService.createTransaction(courseId, userId, paymentMethod).subscribe({
      next: (response) => {
        console.log('Transacción creada:', response);
        this.createdTRX = response;
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Transacción creada con éxito'
        });
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo crear la transacción'
        });
      }
    });
  }

  confirmTransfer() {
    // Lógica para manejar la confirmación
  }

  getPaymentSchemeColor(scheme: string): 'success' | 'secondary' | 'info' | 'warn' {
    switch (scheme) {
      case 'single_payment':
        return 'info';
      case 'installments':
        return 'success';
      default:
        return 'warn';
    }
  }
}
