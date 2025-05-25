import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MainMenu } from '../../ui/navs/main-menu.component';

import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';

import { PaginatorModule } from 'primeng/paginator';
import { DropdownModule } from 'primeng/dropdown';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  Validators,
} from '@angular/forms';

import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { PanelMenuModule } from 'primeng/panelmenu';
import { SplitterModule } from 'primeng/splitter';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { InputNumberModule } from 'primeng/inputnumber';
import { DialogModule } from 'primeng/dialog';
import { FieldsetModule } from 'primeng/fieldset';
import { PanelModule } from 'primeng/panel';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { Roles, User } from '../../global.types';
import { OperatorsService } from './operators.service';
import { MessageService } from 'primeng/api';
import { ReactiveFormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { inject } from '@angular/core';
@Component({
  selector: 'table-operators',
  templateUrl: './operators.component.html',
  styleUrls: ['./operators.component.scss'],
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
    InputTextModule,
    PasswordModule,
    InputNumberModule,
    ReactiveFormsModule,
    DialogModule,
  ],
  providers: [MessageService],
})
export class OperatorsComponent implements OnInit {
  private toastr = inject(ToastrService);
  operators: User[] = [];
  selectedOperator: any;
  displayDialog: boolean = false;
  loading: boolean = true;
  totalRecords: number = 0;
  rowsPerPageOptions: number[] = [10, 20, 30];
  rowsPerPage: number = this.rowsPerPageOptions[0];
  currentPage: number = 0;

  editForm: FormGroup;
  selectedFilter: string = 'user.identificationNumber';
  searchText: string = '';
  filteredOperators: User[] = [];

  filterOptions = [
    { label: 'Identificación', value: 'identificationNumber' },
    { label: 'Nombre', value: 'firstName' },
    { label: 'Apellido', value: 'lastName' },
    { label: 'Email', value: 'email' },
    { label: 'Estado', value: 'status' },
  ];

  constructor(
    private operatorService: OperatorsService,
    private fb: FormBuilder,
    private messageService: MessageService
  ) {
    this.editForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.maxLength(50)]],
      lastName: ['', [Validators.required, Validators.maxLength(50)]],
      identificationNumber: [
        null,
        [Validators.required, Validators.pattern(/^[0-9]*$/)],
      ],
      password: ['', [Validators.minLength(8)]],
    });
  }

  ngOnInit() {
    this.getOperators();
  }

  getOperators() {
    this.operatorService.getOperators().subscribe(
      (data: User[]) => {
        this.operators = data;
        this.totalRecords = data.length;
        this.loading = false;
        console.log('Operadores obtenidos:', this.operators);
      },
      (error) => {
        console.error('Error fetching operators:', error);
        this.loading = false;
      }
    );
  }

  showAuditLog(user: User) {
    console.log('Mostrar historial para:', user.id);
  }

  showUserDetails(user: User) {
    this.selectedOperator = user;
    this.editForm.patchValue({
      firstName: user.firstName,
      lastName: user.lastName,
      identificationNumber: parseInt(user.identificationNumber, 10),
      password: '',
    });
    this.displayDialog = true;
  }

  updateOperator() {
    if (this.editForm.invalid || !this.selectedOperator) return;

    const formData = {
      ...this.prepareUpdateData(),
      id: this.selectedOperator.id,
    };

    this.operatorService.updateOperator(formData).subscribe({
      next: (updatedUser) => {
        this.updateLocalData(updatedUser);
        this.displayDialog = false;
        this.showSuccess('Operador actualizado exitosamente');
        this.toastr.success(
          'Operador actualizado exitosamente',);
        this.getOperators()
        this.updateLocalData(updatedUser);
      },
      error: (error) => this.handleError('Error actualizando operador', error),
    });
  }

  private prepareUpdateData(): any {
    const data: any = { ...this.editForm.value };

    // Limpiar datos no modificados
    if (!data.password) delete data.password;
    data.identificationNumber = data.identificationNumber.toString();
    data.role = 'accounting' as Roles.OPERATOR;
    return data;
  }

  private updateLocalData(updatedUser: User) {
    const index = this.operators.findIndex((u) => u.id === updatedUser.id);
    if (index > -1) {
      this.operators[index] = updatedUser;
      this.operators = [...this.operators]; // Forzar detección de cambios
    }
  }

  private showSuccess(message: string) {
    this.messageService.add({
      severity: 'success',
      summary: 'Éxito',
      detail: message,
    });
  }

  private handleError(summary: string, error: any) {
    console.error(summary, error);
    this.messageService.add({
      severity: 'error',
      summary: summary,
      detail: error.message || 'Error desconocido',
    });
  }

  // Helper para acceso fácil a los controles del formulario
  get f() {
    return this.editForm.controls;
  }

  filterTable() {
    const search = this.searchText.toLowerCase().trim();
    const fieldPath = this.selectedFilter;

    if (!search) {
      this.filteredOperators = [...this.operators];
      return;
    }

    this.filteredOperators = this.operators.filter((operator) => {
      const fieldValue = this.getFieldValue(operator, fieldPath);

      if (fieldValue === null || fieldValue === undefined) {
        return false;
      }

      return fieldValue.toString().toLowerCase().includes(search);
    });
  }

  private getFieldValue(obj: any, path: string): any {
    return path.split('.').reduce((acc, part) => {
      if (acc === null || acc === undefined || typeof acc !== 'object') {
        return undefined;
      }
      return acc[part];
    }, obj);
  }
}
