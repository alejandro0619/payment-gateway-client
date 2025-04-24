import { Component, OnInit } from '@angular/core';
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
@Component({
  selector: 'app-transactions.html',
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
  ],
  templateUrl: './transactions.component.html',
})
export class TransactionsComponent {
  transactions: Transaction[] = [];
  selectedTransaction: Transaction | null = null;
  displayDialog: boolean = false;
  first: number = 0;
  rows: number = 5;

  selectedFilter: string = 'id';
  searchText: string = '';
  filteredTransactions: any[] = [];

  filterOptions = [
    { label: 'Transaction ID', value: 'id' },
    { label: 'Course Name', value: 'course.name' },
    { label: 'Amount', value: 'amount' },
    { label: 'Payment Method', value: 'paymentMethod' },
    { label: 'Status', value: 'status' },
    { label: 'User Email', value: 'user.email' },
    { label: 'Validated By', value: 'validatedBy.email' },
  ];

  action_btn_on_trx = [
    {
      label: 'Acciones',
      items: [
        {
          label: 'Validar la transacción', icon: 'pi pi-check', command: () => this.onReview(),
        },
        {
          label: 'Rechazar la transacción', icon: 'pi pi-times', command: () => this.onReject(),
        },
      ]
    },
  ]
  constructor(private transactionsService: TransactionsService) { }

  onReview() { }
  onReject() { }

  checkStatusToRenderActionMenu(status: TransactionStatus) {
    return status.toLowerCase() === 'completed' || status.toLowerCase() === 'rejected';
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
    if (!this.searchText.trim()) {
      this.filteredTransactions = [...this.transactions];
      return;
    }
  }

  getPaymentMethodSeverity(method: string) {
    switch (method.toLowerCase()) {
      case 'tarjeta de crédito': return 'success';
      case 'paypal': return 'warn';
      case 'transferencia': return 'info';
      default: return 'secondary';
    }
  }

  getStatusSeverity(status: string) {
    switch (status.toLowerCase()) {
      case 'completed': return 'success';
      case 'ready_to_be_checked': return 'warn';
      case 'rechazado': return 'danger';
      default: return 'info';
    }
  }

  getStatusLabel(status: string) {
    switch (status.toLowerCase()) {
      case 'completed': return 'Completada';
      case 'ready_to_be_checked': return 'Lista para revisión';
      case 'in_process': return 'En procreso';
      case 'rejected': return 'Rechazada';
      default: return 'Desconocido';
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
