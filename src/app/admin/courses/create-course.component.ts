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

interface PaymentScheme {
  name: string;
  code: string;
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
    PopoverModule
  ],
  templateUrl: './create-course.component.html',
  providers: [MessageService]
})
export class CreateCourseComponent {
  courseForm: FormGroup;
  visible: boolean = false;
  uploadedFile: File | null = null;
  loading: boolean = false;

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
      dates: [null, Validators.required],
    });

    this.courseForm.get('dates')?.valueChanges.subscribe((dates: Date[]) => {
      this.sortDates(dates)
    })
}

sortDates(dates?: Date[]): void {
  const datesToSort = dates || this.courseForm.get('dates')?.value;
  
  if (datesToSort?.length > 0) {
    // Ordenar fechas
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
          image: e.target.result // URL temporal de la imagen
        });
      };
      reader.readAsDataURL(file);
    }
  }


  onSubmit() {
    if (this.courseForm.invalid) {
      this.markAllAsTouched();
      return;
    }

    this.loading = true;
     
    // This data goes to the first endpoint: /courses
    const formData = new FormData();
    formData.append('name', this.courseForm.value.name);
    formData.append('price', this.courseForm.value.price.toString());
    formData.append('description', this.courseForm.value.description);
    formData.append('paymentScheme', this.courseForm.value.paymentScheme);
    formData.append('dates', JSON.stringify(this.courseForm.value.dates));


    const formDataImage = new FormData();
    console.log(this.courseForm.value.dates)
    if (this.uploadedFile) {
      formDataImage.append('image', this.uploadedFile);
    }

    this.http.post('http://localhost:3000/course/', formData)
      .subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Curso creado correctamente'
          });
          this.courseForm.reset();
          this.visible = false;
        },
        error: (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudo crear el curso'
          });
          console.error('Error:', error);
        },
        complete: () => {
          this.loading = false;
        }
      });
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