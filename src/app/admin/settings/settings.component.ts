import { Component } from '@angular/core';
import { CommonModule, formatDate } from '@angular/common';
import { MainMenu } from '../../ui/navs/main-menu.component';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { DialogModule } from 'primeng/dialog';
import { PaginatorModule } from 'primeng/paginator';
import { DropdownModule } from 'primeng/dropdown';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { PanelMenuModule } from 'primeng/panelmenu';
import { SplitterModule } from 'primeng/splitter';
import { FieldsetModule } from 'primeng/fieldset';
import { PanelModule } from 'primeng/panel';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { InputNumberModule } from 'primeng/inputnumber';
import { MessageService } from 'primeng/api';
import { User } from '../../global.types';
import { SettingsService } from './settings.service';
import { OnInit } from '@angular/core';

@Component({
  selector: 'app-settings',
  imports: [
    CommonModule,
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
  templateUrl: './settings.component.html',
})
export class SettingsComponent implements OnInit {
  editForm: FormGroup;
  selectedFilter: string = 'user.identificationNumber';
  searchText: string = '';
  filteredUsers: User[] = [];
  users: User[] = [];
  totalRecords: number = 0;
  rowsPerPageOptions: number[] = [10, 20, 30];
  rowsPerPage: number = this.rowsPerPageOptions[0];
  currentPage: number = 0;
  displayDialog: boolean = false;
  selectedUser: User | null = null;
  filterOptions = [
    { label: 'Identificación', value: 'identificationNumber' },
    { label: 'Nombre', value: 'firstName' },
    { label: 'Apellido', value: 'lastName' },
    { label: 'Email', value: 'email' },
    { label: 'Estado', value: 'status' },
  ];
  constructor(
    private fb: FormBuilder,
    private messageService: MessageService,
    private settingsService: SettingsService
  ) {
    this.editForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.maxLength(50)]],
      lastName: ['', [Validators.required, Validators.maxLength(50)]],
      identificationNumber: [
        null,
        [Validators.pattern(/^[0-9]*$/)],
      ],
      password: ['', [Validators.minLength(8)]],
    });
  }
  showDialog(user: User) {

    this.displayDialog = true;
    this.selectedUser = user;

  }

  filterTable() {
    const search = this.searchText.toLowerCase().trim();
    const fieldPath = this.selectedFilter;

    if (!search) {
      this.filteredUsers = [...this.users];
      return;
    }

    this.filteredUsers = this.users.filter((user) => {
      let fieldValue = this.getFieldValue(user, fieldPath);

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

  ngOnInit(): void {
    this.loadUsers();
  }
  private prepareUserData(data: any): any {
    const cleanedData: any = {};

    for (const key in data) {
      const value = data[key];
      // Si el valor no está vacío ni null ni undefined, lo agregamos
      if (
        value !== null &&
        value !== undefined &&
        !(typeof value === 'string' && value.trim() === '')
      ) {
        cleanedData[key] = value;
      }
    }

    return cleanedData;
  }

  updateUser() {
    console.log('Updating user with data:', this.editForm.value);
    if (this.editForm.invalid) {
      console.log('Form is invalid:', this.editForm.errors);
      this.messageService.add({
        severity: 'error',
        summary: 'Formulario inválido',
        detail: 'Por favor, complete todos los campos requeridos correctamente.',
      });
      return;
    }
    const rawUserData = this.editForm.value;
    const cleanedUserData = this.prepareUserData(rawUserData);


    const userId = this.selectedUser?.id;
    this.settingsService.updateUser({ ...cleanedUserData, id: userId }).subscribe({
      next: () => {
        console.log('User updated successfully');
        this.messageService.add({
          severity: 'success',
          summary: 'Usuario actualizado',
          detail: 'El usuario ha sido actualizado correctamente.',
        });
        this.loadUsers();
        this.displayDialog = false;
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error al actualizar usuario',
          detail: error.message,
        });
      },
    });
  }
  loadUsers(): void {
    this.settingsService.getUsers().subscribe({
      next: (users) => {
        this.users = users;
        this.filteredUsers = [...users]; // Inicializa también la tabla filtrada
        this.totalRecords = users.length;
        console.log('Usuarios cargados:', this.users);
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error al cargar usuarios',
          detail: error.message,
        });
      },
    });
  }
}
