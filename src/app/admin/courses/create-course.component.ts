import { Component } from '@angular/core';
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
import { MessageModule } from 'primeng/message';
import { SliderModule } from 'primeng/slider';
import { TableModule } from 'primeng/table';
import { ChangeDetectorRef } from '@angular/core';

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
    MessageModule,
    SliderModule,
    TableModule
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
  totalPercentage: number = 0;

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
    private messageService: MessageService,
    private cdRef: ChangeDetectorRef
  ) {
    this.courseForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(100)]],
      price: [0, [Validators.required, Validators.min(1)]],
      description: ['', [Validators.required, Validators.maxLength(500)]],
      image: [null],
      paymentScheme: ['single_payment', Validators.required],
      dates: [null,],
      installmentsAmount: [0],
      installments: this.fb.array([]),
    });

    this.courseForm.get('dates')?.valueChanges.subscribe((dates: Date[]) => {
      this.sortDates(dates)
    })
  }
  get installmentsArray(): FormArray {
    return this.courseForm.get('installments') as FormArray;
  }
  shouldDisableNextButton(): boolean {
    const scheme = this.courseForm.get('paymentScheme')?.value;

    if (scheme === 'single_payment') {

      return this.courseForm.invalid;
    }

    return (
      this.courseForm.invalid ||
      this.totalPercentage !== 100 ||
      !this.areDatesSequential() ||
      this.installmentsArray.invalid
    );
  }

  generateInstallmentsTable(): void {
    const num = this.courseForm.get('installmentsAmount')?.value || 1;
    this.installmentsArray.clear();

    const equalPercentage = 100 / num;
    const currentDate = new Date();

    for (let i = 0; i < num; i++) {
      this.installmentsArray.push(this.fb.group({
        date: [new Date(currentDate.setMonth(currentDate.getMonth() + 1)), [Validators.required, this.dateAfterPreviousValidator(i)]],
        percentage: [
          i === num - 1
            ? 100 - (Math.floor(equalPercentage) * (num - 1))
            : Math.floor(equalPercentage),
          [Validators.required, Validators.min(1), Validators.max(100)]
        ]
      }));
    }

    this.updateTotalPercentage();
  }
  onSelectImage(event: { originalEvent: Event; files: File[] }): void {
    const file = event.files[0];
    if (!file) return;
    console.log("Imagen seleccionada:", file);

    const reader = new FileReader();
    reader.onload = () => {
      this.courseForm.patchValue({ image: reader.result }); // Solo para preview
    };
    reader.readAsDataURL(file);

    this.uploadedFiles = file; // Guarda el archivo para subirlo después
  }



  private dateAfterPreviousValidator(index: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (index === 0) return null;

      const previousControl = this.installmentsArray.at(index - 1);
      if (!previousControl || !control.value) return null;

      const previousDate = previousControl.get('date')?.value;
      const currentDate = control.value;

      return currentDate > previousDate ? null : { invalidDateOrder: true };
    };
  }
  get isInstallmentsValid(): boolean {
    if (this.courseForm.get('paymentScheme')?.value === 'single_payment') return true;

    return this.totalPercentage === 100 &&
      this.installmentsArray.valid &&
      this.areDatesSequential();
  }
  areDatesSequential(): boolean {
    for (let i = 1; i < this.installmentsArray.length; i++) {
      const prevDate = this.installmentsArray.at(i - 1).get('date')?.value;
      const currDate = this.installmentsArray.at(i).get('date')?.value;

      if (!currDate || currDate <= prevDate) return false;
    }
    return true;
  }
  // Actualizar total
  updateTotalPercentage(): void {
    this.totalPercentage = this.installmentsArray.controls
      .reduce((sum, control) => sum + (control.value.percentage || 0), 0);
  }

  // Eliminar cuota
  removeInstallment(index: number): void {
    this.installmentsArray.removeAt(index);
    this.updateTotalPercentage();
  }

  getInstallmentsData() {
    return this.installments.map((installments) => ({
      date: installments.date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      }),
      percentage: installments.percentage,
      amount: this.courseForm.value.price * (installments.percentage / 100)
    }))
  }

  sortDates(dates?: Date[]): void {
    const datesToSort = dates || this.courseForm.get('dates')?.value;

    if (datesToSort?.length > 0) {

      const sorted = [...datesToSort].sort((a, b) => a.getTime() - b.getTime());

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
      const imageUrl = this.uploadedFiles
        ? await this.uploadImage().toPromise()
        : null;


      // 2. Crear objeto del curso con la URL de la imagen
      const courseData = {
        name: this.courseForm.value.name,
        price: this.courseForm.value.price,
        description: this.courseForm.value.description,
        paymentScheme: this.courseForm.value.paymentScheme,
        installments: this.installmentsArray.value,
        image: imageUrl
      };
      console.log("esto es lo que se va a guardar", courseData);
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
      this.loading = false;
    } catch (error) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Error en el proceso'
      });
      console.error('Error:', error);
      this.loading = false;
    } finally {
      this.loading = false;
    }
  }

  private uploadImage() {
    if (!this.uploadedFiles) {
      throw new Error('No se ha seleccionado ninguna imagen para subir.');
    }

    const formData = new FormData();
    formData.append('file', this.uploadedFiles, this.uploadedFiles.name); // usa el nombre real del archivo

    return this.http.put<{ url: string }>(
      'http://localhost:3000/course/upload',
      formData
    ).pipe(
      map(response => response.url),
      catchError(error => {
        console.error('Error en uploadImage', error);
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