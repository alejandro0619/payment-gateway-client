import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputNumber } from 'primeng/inputnumber';
import { InputText } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { ResetPasswordsService } from './reset-passwords.service';

@Component({
  selector: 'app-password-recovery',
  templateUrl: './generate.component.html',
  styleUrls: ['./generate.component.css'],
  standalone: true,
  imports: [
    ButtonModule,
    ReactiveFormsModule,
    DialogModule,
    CommonModule,
    InputText,
    InputNumber,
    ToastModule
  ],
  providers: [MessageService]
})
export class PasswordRecoveryComponent {
  private _displayModal = false;

  @Input()
  get displayModal(): boolean {
    return this._displayModal;
  }
  set displayModal(val: boolean) {
    this._displayModal = val;

    if (val) {
      this.resetForms();
    }
  }

  @Output() displayModalChange = new EventEmitter<boolean>();

  step: 'cedula' | 'otp' = 'cedula';
  isLoading = false;
  cedulaForm;
  otpForm;

  private userId = '';
  private email = '';

  constructor(
    private fb: FormBuilder,
    private resetService: ResetPasswordsService,
    private messageService: MessageService,
    private router: Router
  ) {
    this.cedulaForm = this.fb.group({
      identificationNumber: ['', [
        Validators.required,
        Validators.maxLength(10),
        Validators.pattern(/^\d{5,10}$/)
      ]]
    });

    this.otpForm = this.fb.group({
      otp: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]],
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]]
    });
  }

  resetForms() {
    this.step = 'cedula';
    this.isLoading = false;
    this.cedulaForm.reset();
    this.otpForm.reset();
  }

  onDialogClose() {
    this.resetModal();
  }

  resetModal() {
    this._displayModal = false;
    this.resetForms();
    this.displayModalChange.emit(false);
  }

  openModal() {
    this._displayModal = true;
    this.resetForms();
    this.displayModalChange.emit(true);
  }

  onCedulaSubmit() {
    if (this.cedulaForm.invalid) return;

    this.isLoading = true;
    const cedula = this.cedulaForm.value.identificationNumber;

    this.resetService.requestPasswordReset(cedula as string).subscribe({
      next: (res) => {
        this.isLoading = false;
        if (res.code === 'success') {
          this.userId = res.userId;
          this.email = res.email;
          this.step = 'otp';
          this.messageService.add({ severity: 'success', summary: 'Correo enviado', detail: 'Revisa tu bandeja de entrada' });
        } else {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Cédula no válida' });
        }
      },
      error: (err) => {
        this.isLoading = false;
        this.messageService.add({ severity: 'error', summary: 'Error', detail: err.message });
      }
    });
  }

  onOtpSubmit() {
    if (this.otpForm.invalid) return;

    const { otp, newPassword, confirmPassword } = this.otpForm.value;

    if (newPassword !== confirmPassword) {
      this.messageService.add({ severity: 'warn', summary: 'Advertencia', detail: 'Las contraseñas no coinciden' });
      return;
    }

    this.isLoading = true;

    this.resetService.validateOTP(+(otp as string), this.cedulaForm.value.identificationNumber as string, newPassword as string).subscribe({
      next: (isValid) => {
        this.isLoading = false;
        if (isValid) {
          this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Contraseña actualizada correctamente' });
          this.resetModal();
          this.router.navigate(['/auth/login']);
        } else {
          this.messageService.add({ severity: 'error', summary: 'OTP inválido', detail: 'Verifica el código ingresado' });
          this.otpForm.get('otp')?.reset();
        }
      },
      error: (err) => {
        this.isLoading = false;
        this.messageService.add({ severity: 'error', summary: 'Error', detail: err.message });
      }
    });
  }
}
