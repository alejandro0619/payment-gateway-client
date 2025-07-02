import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OperatorNavigationComponent } from '../ui/navs/operator-navigation.component';
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
    TagModule,
  ],
  templateUrl: './payment-record.component.html',
})
export class PaymentRecordComponent implements OnInit {
  constructor(
    private dashboardService: DashboardService,
    private translationService: PaymentTranslationService
  ) {}

  selectedFilter: string = 'course.name';
  searchText: string = '';
  filteredTransactions: Transaction[] = [];

  filterOptions = [
    { label: 'Curso', value: 'course.name' },
    { label: 'Estudiante', value: 'user.firstName' },
    { label: 'Cédula', value: 'user.identificationNumber' },
    { label: 'Correo', value: 'user.email' },
    { label: 'Monto', value: 'amount' },
    { label: 'Método', value: 'paymentMethod' },
    { label: 'Estado', value: 'status' },
    { label: 'Esquema', value: 'course.paymentScheme' },
  ];
  ngOnInit() {
    this.dashboardService.getTransactionsHistory().subscribe({
      next: (data) => {
        this.transactions = data;
      },
      error: (error) => {
        console.error('Error fetching transactions:', error);
      },
    });
  }
  transactions: Transaction[] = [];

  async downloadStyledPDF() {
  const { jsPDF } = await import('jspdf');

  const pdf = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4',
  });

  const colors = {
    primary: '#3498db',
    headerBg: '#4CAF50',
    headerText: '#ffffff',
    rowEven: '#f9f9f9',
    rowOdd: '#ffffff',
    text: '#333333',
  };

  const margin = { top: 20, left: 10, right: 10, bottom: 20 };
  const pageWidth = pdf.internal.pageSize.getWidth() - margin.left - margin.right;
  let yPos = margin.top;

  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(14);
  pdf.setTextColor(colors.headerBg);
  pdf.text('REPORTE DE PAGOS', pdf.internal.pageSize.getWidth() / 2, yPos, {
    align: 'center',
  });

  yPos += 10;

  pdf.setFontSize(10);
  pdf.setTextColor(100);
  pdf.text(
    `Generado el ${new Date().toLocaleDateString()} a las ${new Date().toLocaleTimeString()}`,
    pdf.internal.pageSize.getWidth() / 2,
    yPos,
    { align: 'center' }
  );

  yPos += 15;

  const columns = [
    { title: 'CURSO', dataKey: 'course' },
    { title: 'ESTUDIANTE', dataKey: 'student' },
    { title: 'CÉDULA', dataKey: 'idNumber' },
    { title: 'CORREO', dataKey: 'email' },
    { title: 'MONTO', dataKey: 'amount' },
    { title: 'MÉTODO', dataKey: 'method' },
    { title: 'ESTADO', dataKey: 'status' },
    { title: 'ESQUEMA', dataKey: 'scheme' },
  ];

  const dataToExport = this.filteredTransactions.length > 0 ? this.filteredTransactions : this.transactions;

  const tableData = dataToExport.map((trx) => ({
    course: trx.course?.name || 'N/A',
    student: trx.user?.firstName || 'N/A',
    idNumber: trx.user?.identificationNumber || 'N/A',
    email: trx.user?.email || 'N/A',
    amount: typeof trx.amount === 'number' ? `$${trx.amount}` : trx.amount,
    method: this.getPaymentMethodTranslation(trx.paymentMethod || 'N/A'),
    status: this.getStatusTranslation(trx.status),
    scheme: this.getPaymentSchemeTranslation(trx.course?.paymentScheme || 'N/A'),
  }));

  const autoTable = (await import('jspdf-autotable')).default;
  autoTable(pdf, {
    startY: yPos,
    head: [columns.map((c) => c.title)],
    body: tableData.map((row) =>
      columns.map((c) => row[c.dataKey as keyof typeof row])
    ),
    styles: {
      fontSize: 9,
      textColor: colors.text,
    },
    headStyles: {
      fillColor: colors.headerBg,
      textColor: colors.headerText,
    },
    alternateRowStyles: { fillColor: colors.rowEven },
    margin: { left: margin.left, right: margin.right },
    theme: 'grid',
    didDrawPage: (data: any) => {
      if (data.pageNumber === pdf.getNumberOfPages()) {
        pdf.setFontSize(10);
        pdf.setTextColor(colors.primary);
        pdf.text(
          `Total de transacciones: ${dataToExport.length}`,
          margin.left,
          pdf.internal.pageSize.getHeight() - margin.bottom
        );
        pdf.text(
          '© Sistema Académico',
          pdf.internal.pageSize.getWidth() - margin.right,
          pdf.internal.pageSize.getHeight() - margin.bottom,
          { align: 'right' }
        );
      }
    },
  });

  const fileName = `Reporte_Pagos_${new Date().toISOString().slice(0, 10)}.pdf`;
  pdf.save(fileName);
}

  getStatusTranslation(status: string): string {
    return this.translationService.translatePaymentStatus(status);
  }
  getPaymentMethodTranslation(method: string): string {
    return this.translationService.translatePaymentMethod(method);
  }
  getPaymentSchemeTranslation(scheme: string): string {
    return this.translationService.translatePaymentScheme(scheme);
  }
  getStatusSeverity(
    status: string
  ): 'success' | 'info' | 'warn' | 'danger' | undefined {
    switch (status) {
      case 'completed':
        return 'success';
      case 'ready_to_be_checked':
        return 'warn';
      default:
        return 'info';
    }
  }

  getPaymentMethodSeverity(
    method: string
  ): 'success' | 'info' | 'warn' | 'danger' | undefined {
    switch (method) {
      case 'zelle':
        return 'info';
      case 'paypal':
        return 'success';
      default:
        return 'warn';
    }
  }

  getPaymentSchemeSeverity(
    scheme: string
  ): 'success' | 'info' | 'warn' | 'danger' | undefined {
    switch (scheme) {
      case 'single_payment':
        return 'success';
      case 'installments':
        return 'warn';
      default:
        return 'info';
    }
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
            const translatedStatus = this.getStatusTranslation(
                trx.status
            ).toLowerCase();
            if (
                originalStatus.includes(search) ||
                translatedStatus.includes(search)
            ) {
                return true;
            }
        }

        if (fieldPath === 'paymentMethod') {
            const method = trx.paymentMethod || '';
            const originalMethod = method.toLowerCase();
            const translatedMethod =
                this.getPaymentMethodTranslation(method).toLowerCase();
            if (
                originalMethod.includes(search) ||
                translatedMethod.includes(search)
            ) {
                return true;
            }
        }

        if (fieldPath === 'course.paymentScheme') {
            const scheme = trx.course?.paymentScheme || '';
            const originalScheme = scheme.toLowerCase();
            const translatedScheme =
                this.getPaymentSchemeTranslation(scheme).toLowerCase();
            if (
                originalScheme.includes(search) ||
                translatedScheme.includes(search)
            ) {
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
}
