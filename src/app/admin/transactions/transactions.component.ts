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
import { Nullable } from 'primeng/ts-helpers';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

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
    private confirmationService: ConfirmationService
  ) { }

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

  showDialog(
    event: Event,
    message: string,
    action: string,
    severity: string,
    header: string = 'Confirmar'
  ) {
    console.log(this.selectedTransaction);
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
        this.transactionsService
          .changeTransactionStatus(
            this.selectedTransaction?.id as string,
            action.toLowerCase() === 'validar' ? 'completed' : 'rejected'
            // I shouldn't send any validatedById since the Authorization token is already in the header and it has the user id in it
          )
          .subscribe({
            next: (response) => {
              console.log('Transacción actualizada:', response);
              this.loadTrx()
              this.displayDialog = false;
            },
            error: (error) => {
              console.error('Error al actualizar la transacción:', error);
              this.loadTrx()
            },
          });
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
      },
    });
  }

  checkStatusToRenderActionMenu(status: TransactionStatus | null) {
    if (!status) {
      return false;
    }
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
    const search = this.searchText.toLowerCase().trim();
    const fieldPath = this.selectedFilter;

    if (!search || !fieldPath) {
      this.filteredTransactions = [...this.transactions];
      return;
    }

    this.filteredTransactions = this.transactions.filter((trx) => {
      const fieldValue = this.getFieldValue(trx, fieldPath);

      if (fieldValue === undefined || fieldValue === null) {
        return false;
      }
      const valueToSearch = fieldValue.toString().toLowerCase();

      // Búsqueda flexible para estados
      if (fieldPath === 'status') {
        return (
          valueToSearch.includes(search) || // Ej: 'rejected'
          this.getStatusLabel(fieldValue).toLowerCase().includes(search) // Ej: 'rechazada'
        );
      }

      return valueToSearch.includes(search);
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

  getPaymentMethodSeverity(method: string | null) {
    if (!method) {
      return 'info';
    }
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

  getStatusSeverity(status: string | null) {
    if (!status) {
      return 'info';
    }
    switch (status.toLowerCase()) {
      case 'completed':
        return 'success';
      case 'ready_to_be_checked':
        return 'warn';
      case 'rejected':
        return 'danger';
      case 'in_process':
        return 'info';
      default:
        return 'info';
    }
  }

  getStatusLabel(status: string | null) {
    if (!status) {
      return 'Desconocido';
    }
    switch (status.toLowerCase()) {
      case 'completed':
        return 'Completada';
      case 'ready_to_be_checked':
        return 'Lista para revisión';
      case 'in_process':
        return 'En proceso';
      case 'rejected':
        return 'Rechazada';
      default:
        return 'Desconocido';
    }
  }
  async downloadStyledPDF() {
    try {
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4',
      });

      const colors = {
        primary: '#3498db',
        headerBg: '#57CC99',
        headerText: '#ffffff',
        rowEven: '#f8f9fa',
        rowOdd: '#ffffff',
        border: '#e0e0e0',
        success: '#27ae60',
        warning: '#f39c12',
        danger: '#e74c3c',
        text: '#333333',
      };

      const margin = {
        left: 10,
        right: 10,
        top: 20,
        bottom: 20,
      };

      const pageWidth =
        pdf.internal.pageSize.getWidth() - margin.left - margin.right;
      let yPos = margin.top;

      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(14);
      pdf.setTextColor(colors.headerBg);
      pdf.text(
        'REPORTE DE TRANSACCIONES',
        pdf.internal.pageSize.getWidth() / 2,
        yPos,
        {
          align: 'center',
        }
      );
      yPos += 10;

      pdf.setFontSize(10);
      pdf.setTextColor(100);
      pdf.text(
        `Generado el ${new Date().toLocaleDateString()} a las ${new Date().toLocaleTimeString()}`,
        pdf.internal.pageSize.getWidth() / 2,
        yPos,
        {
          align: 'center',
        }
      );
      yPos += 15;

      const columns = [
        { title: 'ID', dataKey: 'id', width: 20, align: 'center' as const },
        {
          title: 'CURSO',
          dataKey: 'course',
          width: 50,
          align: 'center' as const,
        },
        {
          title: 'MONTO',
          dataKey: 'amount',
          width: 25,
          align: 'center' as const,
        },
        {
          title: 'MÉTODO',
          dataKey: 'method',
          width: 30,
          align: 'center' as const,
        },
        {
          title: 'ESTADO',
          dataKey: 'status',
          width: 30,
          align: 'center' as const,
        },
        {
          title: 'ESTUDIANTE',
          dataKey: 'student',
          width: 45,
          align: 'center' as const,
        },
        {
          title: 'VALIDADO POR',
          dataKey: 'validator',
          width: 45,
          align: 'center' as const,
        },
        {
          title: 'FECHA',
          dataKey: 'date',
          width: 30,
          align: 'center' as const,
        },
      ];

      const drawTableHeader = () => {
        pdf.setFillColor(colors.headerBg);
        pdf.rect(margin.left, yPos, pageWidth, 12, 'F');
        pdf.setFontSize(10);
        pdf.setTextColor(colors.headerText);
        pdf.setFont('bold');
        let xPos = margin.left;
        columns.forEach((col) => {
          pdf.text(
            col.title,
            xPos + (col.align === 'center' ? col.width / 2 : 5),
            yPos + 8,
            {
              align: col.align,
            }
          );
          xPos += col.width;
        });
        yPos += 12;
      };

      const addNewPage = () => {
        pdf.addPage('landscape');
        yPos = margin.top;
        pdf.setFontSize(12);
        pdf.setTextColor(colors.headerBg);
        pdf.text(
          'REPORTE DE TRANSACCIONES (CONTINUACIÓN)',
          pdf.internal.pageSize.getWidth() / 2,
          yPos,
          {
            align: 'center',
          }
        );
        yPos += 15;
        drawTableHeader();
      };

      const tableData = this.transactions.map((transaction) => ({
        id: transaction.id,
        course: transaction.course?.name || 'N/A',
        amount:
          typeof transaction.amount === 'number'
            ? `$${transaction.amount}`
            : transaction.amount,
        method: transaction.paymentMethod ? transaction.paymentMethod : 'Pago interno',
        status: this.getStatusLabel(transaction.status),
        student: transaction.user?.email || 'N/A',
        validator: transaction.validatedBy?.email || 'N/A',
        date: transaction.createdAt
          ? new Date(transaction.createdAt).toLocaleDateString()
          : 'N/A',
        statusType: transaction.status,
      }));

      drawTableHeader();
      pdf.setFont('helvetica');
      pdf.setFontSize(9);

      tableData.forEach((row, index) => {
        let xPos = margin.left;
        const cellHeights: number[] = [];

        const cellLines = columns.map((col) => {
          const text = String(row[col.dataKey as keyof typeof row]);
          const lines = pdf.splitTextToSize(text, col.width - 4);
          cellHeights.push(lines.length);
          return lines;
        });

        const maxLines = Math.max(...cellHeights);
        const rowHeight = maxLines * 4 + 4;

        if (
          yPos + rowHeight >
          pdf.internal.pageSize.getHeight() - margin.bottom
        ) {
          addNewPage();
        }

        const rowColor = index % 2 === 0 ? colors.rowEven : colors.rowOdd;
        pdf.setFillColor(rowColor);
        pdf.rect(margin.left, yPos, pageWidth, rowHeight, 'F');

        columns.forEach((col, i) => {
          const lines = cellLines[i];
          lines.forEach((line: string, lineIndex: number) => {
            const textY = yPos + 6 + lineIndex * 4;

            if (col.dataKey === 'amount') {
              pdf.setTextColor(colors.success);
            } else if (col.dataKey === 'status') {
              const statusColor =
                row.statusType === 'completed'
                  ? colors.success
                  : row.statusType === 'rejected'
                    ? colors.danger
                    : colors.warning;
              pdf.setTextColor(statusColor);
            } else {
              pdf.setTextColor(colors.text);
            }

            pdf.text(line, xPos + col.width / 2, textY, {
              align: 'center',
              maxWidth: col.width - 4,
            });
          });

          xPos += col.width;
        });

        pdf.setDrawColor(colors.border);
        pdf.line(
          margin.left,
          yPos + rowHeight,
          margin.left + pageWidth,
          yPos + rowHeight
        );

        yPos += rowHeight;
      });

      pdf.setFontSize(10);
      pdf.setTextColor(colors.headerBg);
      pdf.text(
        `Total de transacciones: ${this.transactions.length}`,
        margin.left,
        pdf.internal.pageSize.getHeight() - margin.bottom
      );

      pdf.text(
        '© Sistema Académico',
        pdf.internal.pageSize.getWidth() - margin.right,
        pdf.internal.pageSize.getHeight() - margin.bottom,
        { align: 'right' }
      );

      const fileName = `Reporte_Transacciones_${new Date()
        .toISOString()
        .slice(0, 10)}.pdf`;
      pdf.save(fileName);
    } catch (error) {
      console.error('Error al generar PDF:', error);
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'No se pudo generar el PDF. Por favor intente nuevamente.',
      });
    }
  }

  loadTrx() {
    this.transactionsService.getTransactions().subscribe({
      next: (data) => {
        console.log('Datos recibidos del backend:', data);
        this.transactions = data;
        this.filteredTransactions = [...this.transactions];
      },
      error: (error) => {
        console.error('Error fetching transactions:', error);
      },
    });
  }
  ngOnInit(): void {
    this.loadTrx()
  }
}
