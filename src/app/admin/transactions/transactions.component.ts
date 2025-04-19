import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainMenu } from '../../ui/navs/main-menu.component';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { Transaction } from '../../global.types';
import { DialogModule } from 'primeng/dialog';
import { PaginatorModule } from 'primeng/paginator';
import { DropdownModule } from 'primeng/dropdown';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
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

  ngOnInit(): void {
    this.transactions = [
      {
        id: '1',
        createdAt: '2025-04-18T12:00:00Z',
        updatedAt: null,
        deletedAt: null,
        amount: '150',
        description: 'Compra de curso de Angular',
        paymentMethod: 'paypal',
        status: 'completed',
        course: {
          id: '101',
          name: 'Angular avanzado',
          description: 'Un curso avanzado de Angular',
          price: '200',
          createdAt: '2025-04-01T00:00:00Z',
          updatedAt: '2025-04-05T00:00:00Z',
          deletedAt: null,
          image: null,
        },
        user: { id: 'user1', email: 'usuario@ejemplo.com' },
        validatedBy: { id: 'admin1', email: 'admin@ejemplo.com' },
      },
      {
        id: '2',
        createdAt: '2025-04-17T11:30:00Z',
        updatedAt: null,
        deletedAt: null,
        amount: '100',
        description: 'Curso de TypeScript',
        paymentMethod: 'zelle',
        status: 'in_process',
        course: {
          id: '102',
          name: 'TypeScript completo',
          description: 'Desde cero hasta experto',
          price: '100',
          createdAt: '2025-03-25T00:00:00Z',
          updatedAt: '2025-04-02T00:00:00Z',
          deletedAt: null,
          image: null,
        },
        user: { id: 'user2', email: 'example2@email.com' },
        validatedBy: { id: 'admin2', email: 'admin2@ejemplo.com' },
      },
      {
        id: '2',
        createdAt: '2025-04-17T11:30:00Z',
        updatedAt: null,
        deletedAt: null,
        amount: '100',
        description: 'Curso de TypeScript',
        paymentMethod: 'zelle',
        status: 'in_process',
        course: {
          id: '102',
          name: 'TypeScript completo',
          description: 'Desde cero hasta experto',
          price: '100',
          createdAt: '2025-03-25T00:00:00Z',
          updatedAt: '2025-04-02T00:00:00Z',
          deletedAt: null,
          image: null,
        },
        user: { id: 'user2', email: 'example2@email.com' },
        validatedBy: { id: 'admin2', email: 'admin2@ejemplo.com' },
      },
      {
        id: '2',
        createdAt: '2025-04-17T11:30:00Z',
        updatedAt: null,
        deletedAt: null,
        amount: '100',
        description: 'Curso de TypeScript',
        paymentMethod: 'zelle',
        status: 'in_process',
        course: {
          id: '102',
          name: 'TypeScript completo',
          description: 'Desde cero hasta experto',
          price: '100',
          createdAt: '2025-03-25T00:00:00Z',
          updatedAt: '2025-04-02T00:00:00Z',
          deletedAt: null,
          image: null,
        },
        user: { id: 'user2', email: 'example2@email.com' },
        validatedBy: { id: 'admin2', email: 'admin2@ejemplo.com' },
      },
      {
        id: '3',
        createdAt: '2025-04-16T09:15:00Z',
        updatedAt: null,
        deletedAt: null,
        amount: '250',
        description: 'Curso de React avanzado',
        paymentMethod: 'paypal',
        status: 'ready_to_be_checked',
        course: {
          id: '103',
          name: 'React avanzado',
          description: 'Curso avanzado de React',
          price: '250',
          createdAt: '2025-03-10T00:00:00Z',
          updatedAt: '2025-03-15T00:00:00Z',
          deletedAt: null,
          image: null,
        },
        user: { id: 'user3', email: 'example3@email.com' },
        validatedBy: { id: 'admin1', email: 'admin@ejemplo.com' },
      },
      {
        id: '4',
        createdAt: '2025-04-15T08:45:00Z',
        updatedAt: null,
        deletedAt: null,
        amount: '180',
        description: 'Curso de Vue.js',
        paymentMethod: 'zelle',
        status: 'rejected',
        course: {
          id: '104',
          name: 'Vue desde cero',
          description: 'Curso básico de Vue.js',
          price: '180',
          createdAt: '2025-03-20T00:00:00Z',
          updatedAt: '2025-03-22T00:00:00Z',
          deletedAt: null,
          image: null,
        },
        user: { id: 'user4', email: 'example4@email.com' },
        validatedBy: { id: 'admin2', email: 'admin2@ejemplo.com' },
      },
      {
        id: '5',
        createdAt: '2025-04-14T14:00:00Z',
        updatedAt: null,
        deletedAt: null,
        amount: '300',
        description: 'Curso de Node.js backend',
        paymentMethod: 'paypal',
        status: 'completed',
        course: {
          id: '105',
          name: 'Node.js backend',
          description: 'Curso de servidor con Node.js',
          price: '300',
          createdAt: '2025-02-28T00:00:00Z',
          updatedAt: '2025-03-01T00:00:00Z',
          deletedAt: null,
          image: null,
        },
        user: { id: 'user5', email: 'example5@email.com' },
        validatedBy: { id: 'admin1', email: 'admin@ejemplo.com' },
      },
    ];
    this.filteredTransactions = [...this.transactions];
  }
}
