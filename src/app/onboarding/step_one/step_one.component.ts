import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../envs/env.dev';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { SignupAdminComponent } from '../../auth/signup-admin/signup-admin.component';
@Component({
  selector: 'app-onboarding-admin',
  templateUrl: './step_one.component.html',
  imports: [CommonModule, ReactiveFormsModule, InputTextModule, ButtonModule, CardModule, ToastModule, SignupAdminComponent],
  providers: [MessageService],
  standalone: true
})
export class StepOneComponent {
 
}
