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
    MenuModule
  ],
  templateUrl: './payment-record.component.html',
})
export class PaymentRecordComponent implements OnInit {
  constructor() {}
  
  ngOnInit() {
    
  }
  transactions: any[] = [
    {
      id: 'TRX-001',
      amount: 150,
      paymentMethod: 'Zelle',
      status: 'completed',
      createdAt: '2023-05-15T10:30:00Z',
      course: {
        id: 'CRS-101',
        name: 'CCNA Networking Fundamentals',
        price: 150
      },
      user: {
        id: 'USR-001',
        email: 'student1@example.com',
        name: 'John Doe'
      },
      validatedBy: {
        id: 'OP-001',
        email: 'operator1@academy.com',
        name: 'Operator One'
      }
    },
    {
      id: 'TRX-002',
      amount: 200,
      paymentMethod: 'PayPal',
      status: 'completed',
      createdAt: '2023-05-16T11:45:00Z',
      course: {
        id: 'CRS-102',
        name: 'Python Programming Advanced',
        price: 200
      },
      user: {
        id: 'USR-002',
        email: 'student2@example.com',
        name: 'Jane Smith'
      },
      validatedBy: {
        id: 'OP-001',
        email: 'operator1@academy.com',
        name: 'Operator One'
      }
    },
    {
      id: 'TRX-003',
      amount: 180,
      paymentMethod: 'Credit Card',
      status: 'pending',
      createdAt: '2023-05-17T09:15:00Z',
      course: {
        id: 'CRS-103',
        name: 'AWS Cloud Practitioner',
        price: 180
      },
      user: {
        id: 'USR-003',
        email: 'student3@example.com',
        name: 'Robert Johnson'
      },
      validatedBy: {
        id: 'OP-002',
        email: 'operator2@academy.com',
        name: 'Operator Two'
      }
    },
    {
      id: 'TRX-004',
      amount: 120,
      paymentMethod: 'Bank Transfer',
      status: 'failed',
      createdAt: '2023-05-18T14:20:00Z',
      course: {
        id: 'CRS-104',
        name: 'JavaScript Fundamentals',
        price: 120
      },
      user: {
        id: 'USR-004',
        email: 'student4@example.com',
        name: 'Maria Garcia'
      },
      validatedBy: {
        id: 'OP-002',
        email: 'operator2@academy.com',
        name: 'Operator Two'
      }
    },
    {
      id: 'TRX-005',
      amount: 250,
      paymentMethod: 'Zelle',
      status: 'completed',
      createdAt: '2023-05-19T16:10:00Z',
      course: {
        id: 'CRS-105',
        name: 'Data Science with Python',
        price: 250
      },
      user: {
        id: 'USR-005',
        email: 'student5@example.com',
        name: 'David Wilson'
      },
      validatedBy: {
        id: 'OP-003',
        email: 'operator3@academy.com',
        name: 'Operator Three'
      }
    }
  ];
}