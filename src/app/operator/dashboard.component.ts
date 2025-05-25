import { Component, OnInit } from '@angular/core';
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
import { DashboardService } from './dashboard.service';

interface Transaction {
  id: string;
  course: { name: string };
  amount: number;
  paymentMethod: string;
  status: string;
  user: { email: string };
  validatedBy?: { email: string } | null;
  date: string;
  description: string;
  reference?: string
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
export class DashboardComponent implements OnInit {
  filterOptions = [
    { label: 'ID de la transacción', value: 'id' },
    { label: 'Nombre del curso', value: 'course.name' },
    { label: 'Monto cancelado', value: 'amount' },
    { label: 'Estudiante', value: 'user.email' },
    { label: 'Validado por', value: 'validatedBy.email' },
  ];

  selectedFilter: string = 'id';
  searchText: string = '';
  filteredTransactions: Transaction[] = [];

  transactions: Transaction[] = [];

  constructor(
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private dashboardService: DashboardService, // Asegúrate de importar el servicio correctamente
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
  loadTransactions() {
    this.dashboardService.findTransactions().subscribe(
      (data): void => {
        console.log('Transacciones obtenidas:', data);
        this.transactions = data.map(tx => ({
          id: tx.id,
          course: { name: tx.course && tx.course.name ? tx.course.name : '' },
          amount: parseFloat(tx.amount),
          paymentMethod: tx.paymentMethod,
          status: this.getStatusLabel(tx.status),
          user: { email: tx.user.email },
          date: new Date(tx.createdAt).toLocaleDateString('es-ES'),
          description: tx.description,
          reference: tx.reference || 'N/A',
        }));
        //console.log('Transacciones obtenidas:', this.transactions);
        this.filteredTransactions = [...this.transactions];
      },
      (error) => {
        console.error('Error al obtener transacciones:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudieron cargar las transacciones',
        });
      }
    );
  }
  ngOnInit() {
    this.loadTransactions();
  }
  private getStatusLabel(status: string): string {
    const statusMap: Record<string, string> = {
      'ready_to_be_checked': 'Pendiente',
      'approved': 'Aprobada',
      'rejected': 'Rechazada',
    };

    return statusMap[status] ?? status;
  }


  confirmAcceptTransaction(transaction: Transaction) {
    console.log("dadda")
    this.confirmationService.confirm({
      message: `¿Está seguro de aceptar la transacción ${transaction.id}?`,
      header: 'Confirmar Aceptación',
      icon: 'pi pi-check-circle',
      acceptLabel: 'Aceptar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-success',
      rejectButtonStyleClass: 'p-button-secondary',
      accept: () => {
        this.dashboardService.setTransactionStatus(transaction.id, 'completed').subscribe({
          next: (updatedTransaction) => {
            this.messageService.add({
              severity: 'success',
              summary: 'Éxito',
              detail: 'Transacción aceptada correctamente',
            });
            this.loadTransactions(); // Reload transactions to reflect changes
            this.filterTable();
            console.log('Transacción aceptada:', updatedTransaction);
          }
          ,
          error: (error) => {

            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'No se pudo aceptar la transacción',
            });
          }
        });

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
        this.dashboardService.setTransactionStatus(transaction.id, 'rejected').subscribe({
          next: (updatedTransaction) => {
            this.messageService.add({
              severity: 'success',
              summary: 'Éxito',
              detail: 'Transacción aceptada correctamente',
            });
            this.loadTransactions(); // Reload transactions to reflect changes
            this.filterTable();
            console.log('Transacción aceptada:', updatedTransaction);
          }
          ,
          error: (error) => {

            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'No se pudo aceptar la transacción',
            });
          }
        });
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
