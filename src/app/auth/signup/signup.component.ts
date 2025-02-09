import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-signup',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './signup.component.html',

})
export class SignupComponent {
  form = signal(new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(3)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(8)]),
    confirmPassword: new FormControl('', [Validators.required]),
    country: new FormControl('', [Validators.required]),
    state: new FormControl('', [Validators.required]),
    city: new FormControl('', [Validators.required]),
  }));

  get passwordsMatch() {
    return this.form().value.password === this.form().value.confirmPassword;
  }

  submit() {
    if (this.form().valid && this.passwordsMatch) {
      console.log('Form Submitted', this.form().value);
    }
  }
}
