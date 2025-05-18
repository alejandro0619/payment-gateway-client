import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { PaginatorModule } from 'primeng/paginator';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TagModule } from 'primeng/tag';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MenuModule } from 'primeng/menu';
import { OperatorNavigationComponent } from '../ui/navs/operator-navigation.component';

interface Transaction {
  id: string;
  course: { name: string };
  amount: number;
  paymentMethod: string;
  status: string;
  user: { email: string };
  validatedBy: { email: string } | null;
  date: string;
  description: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    ToastModule,
    PaginatorModule,
    DropdownModule,
    ButtonModule,
    InputTextModule,
    TagModule,
    ConfirmDialogModule,
    MenuModule,
    OperatorNavigationComponent,
  ],
  templateUrl: './dashboard.component.html',
  providers: [MessageService, ConfirmationService],
})
export class DashboardComponent {
  filterOptions = [
    { label: 'ID de la transacción', value: 'id' },
    { label: 'Nombre del curso', value: 'course.name' },
    { label: 'Monto cancelado', value: 'amount' },
    { label: 'Método de pago', value: 'paymentMethod' },
    { label: 'Estado de la transacción', value: 'status' },
    { label: 'Estudiante', value: 'user.email' },
    { label: 'Validado por', value: 'validatedBy.email' },
  ];

  selectedFilter: string = 'id';
  searchText: string = '';
  filteredTransactions: Transaction[] = [];

  transactions: Transaction[] = [
    {
      id: 'TXN001',
      course: { name: 'Curso de Angular Avanzado' },
      amount: 120.0,
      paymentMethod: 'Tarjeta de crédito',
      status: 'Pendiente',
      user: { email: 'estudiante1@correo.com' },
      validatedBy: null,
      date: '2024-05-01',
      description: 'Pago realizado para el curso de Angular Avanzado.',
    },
    {
      id: 'TXN002',
      course: { name: 'Introducción a TypeScript' },
      amount: 80.5,
      paymentMethod: 'PayPal',
      status: 'Aceptada',
      user: { email: 'estudiante2@correo.com' },
      validatedBy: null,
      date: '2024-05-02',
      description: 'Esperando confirmación del pago realizado vía PayPal.',
    },
    {
      id: 'TXN003',
      course: { name: 'Desarrollo Web con NestJS' },
      amount: 150.75,
      paymentMethod: 'Transferencia bancaria',
      status: 'Pendiente',
      user: { email: 'estudiante3@correo.com' },
      validatedBy: null,
      date: '2024-05-03',
      description: 'Comprobante bancario enviado para revisión.',
    },
  ];

  constructor(
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {
    this.filteredTransactions = [...this.transactions]; // Inicializa con todas las transacciones
  }

  getMenuItems(transaction: Transaction): MenuItem[] {
    return [
      {
        label: 'Aceptar transacción',
        icon: 'pi pi-check',
        command: () => this.confirmAcceptTransaction(transaction),
      },
      {
        label: 'Rechazar transacción',
        icon: 'pi pi-times',
        command: () => this.confirmRejectTransaction(transaction),
      },
    ];
  }

  confirmAcceptTransaction(transaction: Transaction) {
    this.confirmationService.confirm({
      message: `¿Está seguro de aceptar la transacción ${transaction.id}?`,
      header: 'Confirmar Aceptación',
      icon: 'pi pi-check-circle',
      acceptLabel: 'Aceptar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-success',
      rejectButtonStyleClass: 'p-button-secondary',
      accept: () => {
        transaction.status = 'Aprobado';
        transaction.validatedBy = { email: 'operador@plataforma.com' };
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Transacción aceptada correctamente',
        });
        this.filterTable(); // Actualiza el filtrado
      },
    });
  }

  confirmRejectTransaction(transaction: Transaction) {
    this.confirmationService.confirm({
      message: `¿Está seguro de rechazar la transacción ${transaction.id}?`,
      header: 'Confirmar Rechazo',
      icon: 'pi pi-times-circle',
      acceptLabel: 'Rechazar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-danger',
      rejectButtonStyleClass: 'p-button-secondary',
      accept: () => {
        transaction.status = 'Rechazado';
        transaction.validatedBy = { email: 'operador@plataforma.com' };
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Transacción rechazada correctamente',
        });
        this.filterTable(); // Actualiza el filtrado
      },
    });
  }

  filterTable() {
    const search = this.searchText.toLowerCase().trim();
    const fieldPath = this.selectedFilter;

    if (!search) {
      this.filteredTransactions = [...this.transactions];
      return;
    }

    this.filteredTransactions = this.transactions.filter((trx) => {
      const fieldValue = this.getFieldValue(trx, fieldPath);

      if (fieldValue === null || fieldValue === undefined) {
        return false;
      }

      return fieldValue.toString().toLowerCase().includes(search);
    });
  }
  // This method is used to get the value of a nested field in an object
  // It takes an object and a string path (e.g., 'course.name') and returns the value at that path
  // If the path does not exist, it returns undefined
  // It uses the reduce method to traverse the object based on the path
  // If at any point the accumulator is null or undefined, it returns undefined
  // It is used in the filterTable method to filter transactions based on the selected field and search text
  
  private getFieldValue(obj: any, path: string): any {
    return path.split('.').reduce((acc, part) => {
      if (acc === null || acc === undefined || typeof acc !== 'object') {
        return undefined;
      }
      return acc[part];
    }, obj);
  }
}
