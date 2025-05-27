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
  constructor(private dashboardService: DashboardService, private translationService: PaymentTranslationService) { }

  ngOnInit() {
    this.dashboardService.getTransactionsHistory().subscribe({
      next: (data) => {
        this.transactions = data;
      },
      error: (error) => {
        console.error('Error fetching transactions:', error);
      }
    });
  }
  transactions: Transaction[] = [];

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