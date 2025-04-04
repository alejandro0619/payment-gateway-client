// Transacciones component TS
import { Component } from '@angular/core';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { TagModule } from 'primeng/tag';

interface Transaction {
    id: string;
    courseName: string;
    amount: number;
    status: string;
}

@Component({
    selector: 'app-transactions-table',
    templateUrl: './transaction-dashboard.component.html',
    standalone: true,
    imports: [TableModule, CommonModule, TagModule],
})
export class TransactionsTableComponent {
    transactions: Transaction[] = [];

    constructor() {
        // Generar datos de prueba
        this.transactions = this.generateMockData(25);
    }

    private generateMockData(count: number): Transaction[] {
        const courses = ['Angular Avanzado', 'React Profesional', 'Node.js Master', 'Docker Essentials', 'AWS Certified'];
        const statuses = ['completed', 'pending', 'failed'];
        
        return Array.from({ length: count }, (_, i) => ({
            id: `TRX-${Date.now()}${i}`,
            courseName: courses[Math.floor(Math.random() * courses.length)],
            amount: Math.random() * 500 + 50,
            status: statuses[Math.floor(Math.random() * statuses.length)]
        }));
    }

    getStatusSeverity(status: string) {
        switch (status.toLowerCase()) {
            case 'completed':
                return 'success';
            case 'pending':
                return 'warn';
            case 'failed':
                return 'danger';
            default:
                return 'info';
        }
    }

    onRowClick(event: any) {
        window.location.href = 'http://localhost:4321/hola'; 
        // Si usas Angular Router sería mejor con:
        // this.router.navigate(['/hola']);
    }
}