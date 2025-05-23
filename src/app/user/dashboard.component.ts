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
import { FormsModule } from '@angular/forms';
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
    UserNavigationComponent,
    FormsModule
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
  transferDate: Date | null = null; // Transfer date
  maxDate: Date = new Date(); // Max date for the calendar
  objectKeys = Object.keys;
  selectedCourse: Course | null = null;
  selectedCourseStatus: string = '';
  balance: number = 0; //   User balance
  isLoadingCourseDetails: boolean = false; // Loading course details

  // This is relevant for the drawer component
  drawerVisible: boolean = false;
  drawerPosition: 'left' | 'right' = 'left';
  createdTRX: CreateTRXResponse | null = null;
  paymentMethod: 'paypal' | 'zelle' | null = null;
  showPaymentFlow: 'paypal' | 'zelle' | null = null;
  companyEmail: string | null = null;
  isSendingZelleConfirmation: boolean = false;

  confirmationCodeZelle: string = ''; // Confirmation code for Zelle
  constructor(
    private dashboardService: DashboardService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.loadCourses();
    this.getBalance();
    this.dashboardService.getCompanyEmail().subscribe({
      next: (email) => {
        this.companyEmail = email;
      }
      , error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo obtener el email de la empresa'
        });
      }
    });
  }

  closeDetails(): void {
    this.selectedCourse = null;
    this.createdTRX = null;
    this.paymentMethod = null;
    this.showPaymentFlow = null;
    this.drawerVisible = false;
    this.isLoadingCourseDetails = false;
    this.loadCourses()

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

  isCourseInNotBoughtOrExpired(courseId: string): boolean {
    if (!this.courses) return false;

    // Safe check in 'not_bought'
    const inNotBought = Array.isArray(this.courses['not_bought']) &&
      this.courses['not_bought'].some((course: any) => course?.id === courseId);
    // Safe check in 'expired'
    const inExpired = Array.isArray(this.courses['expired']) &&
      this.courses['expired'].some((item: any) => {

        if (item?.id === courseId) return true;
        if (item?.course?.id === courseId) return true;
        return false;
      });
    return inNotBought || inExpired;
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
    this.isLoadingCourseDetails = true
    // Check if the current course is available for purchase
    if (this.isCourseInNotBoughtOrExpired(course.id)) {
      this.dashboardService.createTransaction(course.id, localStorage.getItem('usr_info')!).subscribe({
        next: (response) => {
          console.log('Transacción creada:', response);
          this.createdTRX = response;
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Transacción creada con éxito'
          });
          this.isLoadingCourseDetails = false;
        },
        error: (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudo crear la transacción'
          });
        }
      });
    } else {
      this.isLoadingCourseDetails = false;
    }


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

  loadCourses(): void {
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

  getBalance(): void {
    const userId: string = localStorage.getItem("usr_info")!; // Should always exist, since the user is logged in
    this.dashboardService.getUserBalance(userId).subscribe({
      next: (balance) => this.balance = balance.balance,
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo obtener el saldo del usuario, recargue la página'
        });
      }
    });
  }
  // This flag should only be called when the user has enough balance to pay for the course
  // Otherwise, the payment flow should be handled by paypal itself or zelle.
  // We use the flag internally to determine if we should execute confirmTransfer automatically when the transaction is created.
  createTransaction(courseId: string, paymentMethod: 'paypal' | 'zelle', flag: boolean = false): void {
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

  // This method should only be called when the user's balance is > than the course price, otherwise, payment flow should be handled by paypal itself or zelle.
  confirmTransfer(trx: string) {
    this.dashboardService.autorizePayment(trx, "completed").subscribe({
      next: (response) => {
        console.log('Transferencia confirmada:', response);
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Transferencia confirmada con éxito'
        });
        this.getBalance(); // Update the balance after confirming the transfer
        this.loadCourses(); // Reload the courses to reflect the changes
      }
      , error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo confirmar la transferencia'
        });
      }
    });
  }
  sendZelleConfirmation() {
    if (!this.createdTRX?.transactionId || !this.confirmationCodeZelle.trim()) return;

    this.isSendingZelleConfirmation = true;

    this.dashboardService.sendConfirmation(
      this.createdTRX.transactionId,
      this.confirmationCodeZelle.trim()
    ).subscribe({
      next: (response) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Confirmación de Zelle enviada con éxito'
        });
        this.getBalance();
        this.loadCourses();
        this.showPaymentFlow = null;
        this.confirmationCodeZelle = '';
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo enviar la confirmación de Zelle'
        });
      },
      complete: () => {
        this.isSendingZelleConfirmation = false;
      }
    });
  }

  setPaymentMethod(method: 'paypal' | 'zelle') {
    this.paymentMethod = method;
    this.showPaymentFlow = method;
    this.dashboardService.setPaymentMethod(this.createdTRX!.transactionId, method).subscribe({
      next: (response) => {
        console.log('Método de pago establecido:', response);
      }
      , error: (error) => {
      }
    });

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
