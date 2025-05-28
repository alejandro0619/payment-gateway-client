import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OperatorNavigationComponent } from "../ui/navs/operator-navigation.component";
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { PaginatorModule } from 'primeng/paginator';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TagModule } from 'primeng/tag';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MenuModule } from 'primeng/menu';
import { DashboardService } from './dashboard.service';
import { Transaction } from '../global.types';
import { PaymentTranslationService } from '../../core/guards/translate-status';

@Component({
  selector: 'app-payment-record',
  standalone: true,
  imports: [
    CommonModule,
    OperatorNavigationComponent,
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
    TagModule
  ],
  templateUrl: './payment-record.component.html',
})
export class PaymentRecordComponent implements OnInit {
  constructor(
    private dashboardService: DashboardService, 
    private translationService: PaymentTranslationService
  ) { }

  selectedFilter: string = 'course.name';
  searchText: string = '';
  transactions: Transaction[] = [];
  filteredTransactions: Transaction[] = [];
  
  filterOptions = [
    { label: 'Curso', value: 'course.name' },
    { label: 'Estudiante', value: 'user.firstName' },
    { label: 'Cédula', value: 'user.identificationNumber' },
    { label: 'Correo', value: 'user.email' },
    { label: 'Monto', value: 'amount' },
    { label: 'Método', value: 'paymentMethod' },
    { label: 'Estado', value: 'status' },
    { label: 'Esquema', value: 'course.paymentScheme' } 
  ];

  ngOnInit() {
    this.dashboardService.getTransactionsHistory().subscribe({
      next: (data) => {
        this.transactions = data;
        this.filteredTransactions = [...data];
      },
      error: (error) => {
        console.error('Error fetching transactions:', error);
      }
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

    if (fieldValue !== undefined && fieldValue !== null) {
      const valueToSearch = fieldValue.toString().toLowerCase();
      if (valueToSearch.includes(search)) {
        return true;
      }
    }

    if (fieldPath === 'status') {
      const originalStatus = trx.status.toLowerCase();
      const translatedStatus = this.getStatusTranslation(trx.status).toLowerCase();
      if (originalStatus.includes(search) || translatedStatus.includes(search)) {
        return true;
      }
    }

    if (fieldPath === 'paymentMethod') {
      const method = trx.paymentMethod || '';
      const originalMethod = method.toLowerCase();
      const translatedMethod = this.getMethodTranslation(method).toLowerCase();
      if (originalMethod.includes(search) || translatedMethod.includes(search)) {
        return true;
      }
    }

    if (fieldPath === 'course.paymentScheme') {
      const scheme = trx.course?.paymentScheme || '';
      const originalScheme = scheme.toLowerCase();
      const translatedScheme = this.getSchemeTranslation(scheme).toLowerCase();
      if (originalScheme.includes(search) || translatedScheme.includes(search)) {
        return true;
      }
    }

    return false;
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

  getStatusTranslation(status: string): string {
    return this.translationService.translatePaymentStatus(status);
  }

  getMethodTranslation(method: string): string {
    return this.translationService.translatePaymentMethod(method);
  }

  getSchemeTranslation(scheme: string): string {
    return this.translationService.translatePaymentScheme(scheme);
  }
  
  getStatusSeverity(status: string): 'success' | 'info' | 'warn' | 'danger' | undefined {
    switch (status) {
      case 'completed':
        return 'success';
      case 'ready_to_be_checked':
        return 'warn';
      default:
        return 'info';
    }
  }

  getPaymentMethodSeverity(method: string): 'success' | 'info' | 'warn' | 'danger' | undefined {
    switch (method) {
      case 'zelle':
        return 'info';
      case 'paypal':
        return 'success';
      default:
        return 'warn';
    }
  }

  getPaymentSchemeSeverity(scheme: string): 'success' | 'info' | 'warn' | 'danger' | undefined {
    switch (scheme) {
      case 'single_payment':
        return 'success';
      case 'installments':
        return 'warn';
      default:
        return 'info';
    }
  }
}