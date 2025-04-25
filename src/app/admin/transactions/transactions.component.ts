import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainMenu } from '../../ui/navs/main-menu.component';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { Transaction, TransactionStatus } from '../../global.types';
import { DialogModule } from 'primeng/dialog';
import { PaginatorModule } from 'primeng/paginator';
import { DropdownModule } from 'primeng/dropdown';

import { FormsModule } from '@angular/forms';
import { TransactionsService } from './transactions.service';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { PanelMenuModule } from 'primeng/panelmenu';
import { SplitterModule } from 'primeng/splitter';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { MessageService, ConfirmationService } from 'primeng/api';
import { FieldsetModule } from 'primeng/fieldset';
import { PanelModule } from 'primeng/panel';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

@Component({
  selector: 'app-transactions',
  standalone: true,
  imports: [
    CommonModule,
    MainMenu,
    TableModule,
    ToastModule,
    DialogModule,
    PaginatorModule,
    DropdownModule,
    FormsModule,
    ButtonModule,
    CardModule,
    TagModule,
    PanelMenuModule,
    SplitterModule,
    FieldsetModule,
    PanelModule,
    ConfirmDialogModule,
  ],
  templateUrl: './transactions.component.html',
  providers: [MessageService, ConfirmationService, TransactionsService],
})
export class TransactionsComponent {

  transactions: Transaction[] = [];
  selectedTransaction: Transaction | null = null;
  displayDialog: boolean = false;
  first: number = 0;
  rows: number = 5;
  confirmPopupVisible: boolean = false;

  selectedFilter: string = 'id';
  searchText: string = '';
  filteredTransactions: any[] = [];

  filterOptions = [
    { label: 'ID de la transacción', value: 'id' },
    { label: 'Nombre del curso', value: 'course.name' },
    { label: 'Monto cancelado', value: 'amount' },
    { label: 'Método de pago', value: 'paymentMethod' },
    { label: 'Estado de la transacción', value: 'status' },
    { label: 'Estudiante', value: 'user.email' },
    { label: 'Válidado por', value: 'validatedBy.email' },
  ];



  constructor(
    private transactionsService: TransactionsService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
  ) {}

  
  onReview(e: Event) {
    this.showDialog(
      e,
      '¿Está seguro de que desea validar esta transacción?',
      'Validar',
      'success',
      'Validar transacción'
    );
  }

  onReject(e: Event) {
    this.showDialog(
      e,
      '¿Está seguro de que desea rechazar esta transacción?',
      'Rechazar',
      'danger',
      'Rechazar transacción'
    );
  }

  showDialog(event: Event, message: string, action: string, severity: string, header: string = 'Confirmar') {
    console.log(this.selectedTransaction)
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message,
      header,
      closable: true,
            closeOnEscape: true,
      icon: severity === 'success' ? 'pi pi-check' : 'pi pi-times',
      acceptButtonProps: {
        label: action,
        severity: severity,
      },
      rejectButtonProps: {
        label: 'Cancelar',
        severity: 'secondary',
        outlined: true,
      },
      accept: () => {
        this.transactionsService.changeTransactionStatus(
          this.selectedTransaction?.id as string,
          action.toLowerCase() === 'validar' ? 'completed' : 'rejected',
          // I shouldn't send any validatedById since the Authorization token is already in the header and it has the user id in it
        ).subscribe({
          next: (response) => {
            console.log('Transacción actualizada:', response);
          },
          error: (error) => {
            console.error('Error al actualizar la transacción:', error);
          },
        }
        )
        this.messageService.add({
          severity: 'success',
          summary: action,
          detail: 'Acción realizada con éxito',
        });

      },
      reject: () => {


        this.messageService.add({
          severity: 'info',
          summary: 'Cancelado',
          detail: 'Acción cancelada',
        });
      }
    });
  }

  checkStatusToRenderActionMenu(status: TransactionStatus) {
    return (
      status.toLowerCase() === 'completed' ||
      status.toLowerCase() === 'rejected'
    );
  }

  viewDetails(transaction: Transaction) {
    this.selectedTransaction = transaction;
    this.displayDialog = true;
  }

  onPageChange(event: any) {
    this.first = event.first ?? 0;
    this.rows = event.rows ?? 5;
  }

  filterTable() {
    const search = this.searchText.toLowerCase().trim(); //
    const fieldPath = this.selectedFilter;

    if (!search || !fieldPath) {
      this.filteredTransactions = [...this.transactions];
      return;
    }

    this.filteredTransactions = this.transactions.filter((trx) => {
      const fieldValue = this.getFieldValue(trx, fieldPath);

      return fieldValue?.toString().toLowerCase().includes(search);
    });
  }

  getFieldValue(obj: any, path: string): any {
    return path.split('.').reduce((acc, part) => {
      if (acc && typeof acc === 'object' && part in acc) {
        return acc[part];
      }
      return undefined;
    }, obj);
  }

  getPaymentMethodSeverity(method: string) {
    switch (method.toLowerCase()) {
      case 'tarjeta de crédito':
        return 'success';
      case 'paypal':
        return 'warn';
      case 'transferencia':
        return 'info';
      default:
        return 'secondary';
    }
  }

  getStatusSeverity(status: string) {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'success';
      case 'ready_to_be_checked':
        return 'warn';
      case 'rechazado':
        return 'danger';
      default:
        return 'info';
    }
  }

  getStatusLabel(status: string) {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'Completada';
      case 'ready_to_be_checked':
        return 'Lista para revisión';
      case 'in_process':
        return 'En procreso';
      case 'rejected':
        return 'Rechazada';
      default:
        return 'Desconocido';
    }
  }

  ngOnInit(): void {
    this.transactionsService.getTransactions().subscribe({
      next: (data) => {
        this.transactions = data;
        this.filteredTransactions = [...this.transactions];
      },
      error: (error) => {
        console.error('Error fetching transactions:', error);
      },
    });
  }
}
