// Transacciones component TS
import { Component } from '@angular/core';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { TagModule } from 'primeng/tag';
import { AdminDashboardInfoService, Transaction } from '../charts/admin-dashboard-info.service';

@Component({
    selector: 'app-transactions-table',
    templateUrl: './transaction-dashboard.component.html',
    standalone: true,
    imports: [TableModule, CommonModule, TagModule],
})
export class TransactionsTableComponent {
    transactions: Transaction[] = [];

    constructor(private service: AdminDashboardInfoService) { }

    ngOnInit(): void {
        this.service.getLastTransactions().subscribe({
            next: (data) => {
                this.transactions = data;
            },
            error: (err) => {
                console.error('Error al obtener transacciones:', err.message);
            }
        });
    }

    getStatusSeverity(status: string) {
        switch (status.toLowerCase()) {
            case 'completed':
                return 'success';
            default:
                return 'danger';
        }
    }
}