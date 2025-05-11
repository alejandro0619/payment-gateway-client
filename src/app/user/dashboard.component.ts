import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { DrawerModule } from 'primeng/drawer';
import { ButtonModule } from 'primeng/button';
import { AvatarModule } from 'primeng/avatar';
import { MessageService } from 'primeng/api';
import { CardModule } from 'primeng/card';
import { DashboardService } from './dashboard.service';
import { Course, CreateTRXResponse } from '../global.types';
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
  courses: Course[] = [];
  loading: boolean = true;
  width: any;
  showZelleInformation: boolean = false;
  transferDate: Date | null = null; // Fecha de transferencia
  maxDate: Date = new Date(); // Fecha máxima = hoy

  // This is relevant for the drawer component
  drawerVisible: boolean = false;
  drawerPosition: 'left' | 'right' = 'left';
  selectedCourse: Course | null = null;
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
  
  setSelectedCourse(course: Course): void {
    this.closeDetails(); // Close any previous details
    this.selectedCourse = course;
    this.drawerVisible = true;
  }

  private loadCourses(): void {
    this.dashboardService.getCourses().subscribe({
      next: (courses) => {
        this.courses = courses;
        this.loading = false;
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