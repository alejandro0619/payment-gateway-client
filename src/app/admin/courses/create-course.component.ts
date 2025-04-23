import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
  FormControl
} from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { MessageService } from 'primeng/api';

// Importa los módulos de PrimeNG necesarios
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { CalendarModule } from 'primeng/calendar';
import { TextareaModule } from 'primeng/textarea';
import { FileUploadModule, FileUploadEvent } from 'primeng/fileupload';
import { SelectButtonModule } from 'primeng/selectbutton';
import { ToastModule } from 'primeng/toast';
import { StepperModule } from 'primeng/stepper';
import { CardModule } from 'primeng/card';
import { DatePicker } from 'primeng/datepicker';
import { PopoverModule } from 'primeng/popover';
import { FormsModule } from '@angular/forms';
import { catchError, map } from 'rxjs/operators';

interface PaymentScheme {
  name: string;
  code: string;
}
interface Installments {
  date: Date;
  percentage: number;
}

@Component({
  selector: 'app-create-course',
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
    ToastModule,
    StepperModule,
    CardModule,
    DatePicker,
    PopoverModule,
    FormsModule,
  ],
  templateUrl: './create-course.component.html',
  providers: [MessageService]
})
export class CreateCourseComponent {
  courseForm: FormGroup;
  visible: boolean = false;
  uploadedFiles: File | null = null;
  loading: boolean = false;

  /*
    First the user selects the payment scheme option, if it is "single_payment" the total is the one specified in the course's price.
    Otherwise, when the user selects "installment" as payment scheme, the user must select the number of installments and the percentage of each installment.
    First, selects the date of each installment, then, when clicking on the button with the date of the installment as a label, it will pop up a window to enter the percentage of the installment. Clicking on the "save installment" button will save the installment (date and its percentage) and close the window.
    The user can add as many installments as he wants, but the sum of the percentages must be 100%.
  */
  selectedInstallMentIndex: null | number = null;
  installments: Installments[] = [];

  percentagePerInstallment: number = 0; // initially the percentage per installment is 0, this obviosly needs to be updated manually.

  percentageLeftToCover: number = 100; // since the initial value of percentage per installment is 0, the percentage left to cover is 100%, when it reaches 0, the user can no longer add installments.
  canAddInstallments: boolean = true; // initially the user can add installments, this will be updated when the percentage left to cover reaches 0.
  dates: Date[] | undefined;
  sortedDates: Date[] = [];

  payment_scheme: PaymentScheme[] = [
    { name: 'Pago Único', code: 'single_payment' },
    { name: 'Pagos Parciales', code: 'installments' }
  ];

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private messageService: MessageService
  ) {
    this.courseForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(100)]],
      price: [0, [Validators.required, Validators.min(1)]],
      description: ['', [Validators.required, Validators.maxLength(500)]],
      image: [null],
      paymentScheme: ['single_payment', Validators.required],
      dates: [null,],
    });

    this.courseForm.get('dates')?.valueChanges.subscribe((dates: Date[]) => {
      this.sortDates(dates)
    })
  }

  sortDates(dates?: Date[]): void {
    const datesToSort = dates || this.courseForm.get('dates')?.value;

    if (datesToSort?.length > 0) {

      const sorted = [...datesToSort].sort((a, b) => a.getTime() - b.getTime());

      // Actualizar el formulario solo si el orden cambió
      if (JSON.stringify(sorted) !== JSON.stringify(datesToSort)) {
        this.courseForm.get('dates')?.setValue(sorted, { emitEvent: false });
      }

      this.sortedDates = sorted;
    } else {
      this.sortedDates = [];
    }
  }
  onUpload(event: FileUploadEvent) {

    if (event.files.length > 0) {
      const file = event.files[0];
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.courseForm.patchValue({
          image: e.target.result 
        });
      };
      this.uploadedFiles = file
      reader.readAsDataURL(file);
    }
  }

  saveInstallment() {
    if (this.percentageLeftToCover === 0) {
      console.log('Cannot add more installments, total percentage is 100% already.');
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'No puedes agregar más cuotas, el porcentaje total ya es 100%'
      });
      return;
    }

    this.installments.push(
      {
        date: this.sortedDates[this.selectedInstallMentIndex!],
        percentage: this.percentagePerInstallment
      }
    )
    this.percentageLeftToCover = this.percentageLeftToCover - this.percentagePerInstallment;
    this.selectedInstallMentIndex = null;
    this.percentagePerInstallment = 0; // reset the percentage per installment to 0 after saving the installment
    console.log(this.installments, this.percentageLeftToCover);
  }
  async onSubmit() {
    if (this.courseForm.invalid) {
      this.markAllAsTouched();
      return;
    }
  
    this.loading = true;
  
    try {
      // 1. Subir imagen primero si existe
      const imageUrl = this.courseForm.value.image 
        ? await this.uploadImage().toPromise()
        : null;
  
      // 2. Crear objeto del curso con la URL de la imagen
      const courseData = {
        name: this.courseForm.value.name,
        price: this.courseForm.value.price,
        description: this.courseForm.value.description,
        paymentScheme: this.courseForm.value.paymentScheme,
        installments: this.installments.length > 0 ? this.installments : null,
        image: imageUrl
      };
  
      // 3. Guardar el curso
      await this.http.post('http://localhost:3000/course/', courseData, {
        headers: { 'Content-Type': 'application/json' },
      }).toPromise();
  
      this.messageService.add({
        severity: 'success',
        summary: 'Éxito',
        detail: 'Curso creado correctamente'
      });
      
      this.courseForm.reset();
      this.visible = false;
  
    } catch (error) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail:  'Error en el proceso'
      });
      console.error('Error:', error);
    } finally {
      this.loading = false;
    }
  }
  
  private uploadImage() {
    const formData = new FormData();

    formData.append('file', this.uploadedFiles!, this.courseForm.value.name);
  
    return this.http.put<{ url: string }>('http://localhost:3000/course/upload', formData).pipe(
      map(response => response.url),
      catchError(error => {
        throw new Error('Error al subir la imagen');
      })
    );
  }

  markAllAsTouched() {
    Object.values(this.courseForm.controls).forEach(control => {
      control.markAsTouched();
    });
  }

  openModal() {
    this.visible = true;
  }

  closeModal() {
    this.visible = false;
    this.courseForm.reset();
  }
}