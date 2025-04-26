import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
  FormArray,
  ValidatorFn,
  ValidationErrors,
  AbstractControl
} from '@angular/forms';
import { MessageService } from 'primeng/api';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { CalendarModule } from 'primeng/calendar';
import { TextareaModule } from 'primeng/textarea';
import { FileUploadModule, FileUploadEvent } from 'primeng/fileupload';
import { SelectButtonModule } from 'primeng/selectbutton';
import { MessageModule } from 'primeng/message';
import { TableModule } from 'primeng/table';
import { FormsModule } from '@angular/forms';
import { Course } from '../../global.types';

interface PaymentScheme {
  name: string;
  code: string;
}

@Component({
  selector: 'app-modify-courses',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DialogModule,
    ButtonModule,
    InputTextModule,
    InputNumberModule,
    CalendarModule,
    TextareaModule,
    FileUploadModule,
    SelectButtonModule,
    MessageModule,
    TableModule,
    FormsModule
  ],
  templateUrl: './modify-courses.component.html'
})
export class ModifyCoursesComponent {
  @Output() onSave = new EventEmitter<any>();
  courseForm: FormGroup;
  visible = false;
  loading = false;
  totalPercentage = 0;

  payment_scheme: PaymentScheme[] = [
    { name: 'Pago Único', code: 'single_payment' },
    { name: 'Pagos Parciales', code: 'installments' }
  ];

  constructor(
    private fb: FormBuilder,
    private messageService: MessageService
  ) {
    this.courseForm = this.fb.group({
      id: [''], 
      name: ['', [Validators.required, Validators.maxLength(100)]],
      price: [0, [Validators.required, Validators.min(1)]],
      description: ['', [Validators.required, Validators.maxLength(500)]],
      image: [null],
      paymentScheme: ['single_payment', Validators.required],
      installmentsAmount: [0],
      installments: this.fb.array([]),
    });
  }


  markAllAsTouched() {
    Object.values(this.courseForm.controls).forEach(control => {
      control.markAsTouched();
    });
  }
  closeModal() {
    this.visible = false;
    this.courseForm.reset();
  }
}