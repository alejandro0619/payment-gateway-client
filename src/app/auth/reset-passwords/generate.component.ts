import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputNumber } from 'primeng/inputnumber';
import { InputText } from 'primeng/inputtext';


@Component({
  selector: 'app-password-recovery',
  templateUrl: './generate.component.html',
  styleUrls: ['./generate.component.css'],
  imports: [
    ButtonModule,
    ReactiveFormsModule,
    DialogModule,
    CommonModule,
    InputText,
    InputNumber
  ]
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
      // Reinicia el formulario cada vez que se abra el modal
      this.step = 'cedula';
      this.isLoading = false;
      this.cedulaForm.reset();
      this.otpForm.reset();
    }
  }

  @Output() displayModalChange = new EventEmitter<boolean>();


  step: 'cedula' | 'otp' = 'cedula';
  isLoading = false;

  cedulaForm;
  otpForm;

  constructor(private fb: FormBuilder) {
    this.cedulaForm = this.fb.group({
      identificationNumber: ['', [
        Validators.required,
        Validators.maxLength(10),
        Validators.pattern(/^\d{1,10}$/)  // Solo números, máximo 10 dígitos
      ]],
    });
    this.otpForm = this.fb.group({
      otp: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]],
    });
  }
  onDialogClose() {
    this.resetModal();
  }
  resetModal() {
    this.displayModal = false;
    this.step = 'cedula';
    this.isLoading = false;
    this.cedulaForm.reset();
    this.otpForm.reset();
    this.displayModalChange.emit(false);
  }

  openModal() {
    this.displayModal = true;
    this.step = 'cedula';
    this.cedulaForm.reset();
    this.otpForm.reset();
    this.displayModalChange.emit(true);
  }


  onCedulaSubmit() {
    if (this.cedulaForm.invalid) return;

    this.isLoading = true;
    const cedula = this.cedulaForm.value.identificationNumber;

    // Lógica para enviar correo a partir de la cédula
    // Simulación de espera:
    setTimeout(() => {
      this.isLoading = false;
      this.step = 'otp';
    }, 1000);
  }

  onOtpSubmit() {
    if (this.otpForm.invalid) return;

    this.isLoading = true;
    const otp = this.otpForm.value.otp;

    // Lógica para verificar el código OTP
    // Simulación:
    setTimeout(() => {
      this.isLoading = false;
      this.displayModal = false;
      alert('OTP verificado correctamente');
    }, 1000);
  }
}
