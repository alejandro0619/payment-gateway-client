import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { FileUploadModule } from 'primeng/fileupload';
import { StepTwoService, Company } from './step_two.service';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { environment } from '../../../envs/env.dev';

@Component({
  selector: 'app-company-form',
  templateUrl: './step_two.component.html',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ButtonModule,
    FileUploadModule,
    ToastModule
  ],
  providers: [StepTwoService, MessageService],
})
export class StepTwoComponent {
  BACKEND_URL = environment.BACKEND_URL; // Cambia esto según tu configuración
  form: FormGroup;
  isLoading = false;
  previewImage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private stepTwoService: StepTwoService,
    private http: HttpClient,
    private messageService: MessageService,
    private router: Router
  ) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      address: [''],
      telephone_number: [''],
      email: ['', Validators.email],
      description: [''],
      payment_preference: ['both'],
      image: ['']
    });
  }

  async onImageUpload(event: any) {
    const file: File = event.files[0];
    if (!file) return;

    // Previsualización local
    const reader = new FileReader();
    reader.onload = () => {
      this.previewImage = reader.result as string;
    };
    reader.readAsDataURL(file);

    // Subida al backend
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response: any = await this.http.put(`${this.BACKEND_URL}/course/upload`, formData).toPromise();
      const imageUrl = response.url;
      this.form.patchValue({ image: imageUrl });
      console.log('Imagen subida exitosamente:', imageUrl);
      this.messageService.add({
        severity: 'success',
        summary: 'Imagen subida',
        detail: 'La imagen se subió correctamente'
      });
    } catch (error) {
      console.error('Error al subir imagen:', error);
    }
  }

  submit() {
    if (this.form.invalid) return;

    this.isLoading = true;
    const formValue: Company = this.form.value;

    this.stepTwoService.createCompany(formValue).subscribe({
      next: (res) => {
        this.isLoading = false;
        // Mostrar éxito o redirigir
        console.log('Empresa creada exitosamente:', res);
        this.form.reset();
        this.messageService.add({
          severity: 'success',
          summary: 'Empresa creada',
          detail: 'La empresa fue creada exitosamente'
        });
        localStorage.setItem('first-run-false', "true");
        setTimeout(() => {
          this.router.navigate(['/auth/login']);
        }, 1500);
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Error creando empresa:', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Ocurrió un error al crear la empresa'
        });
      }
    });
  }
}
