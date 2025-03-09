import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Dialog } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms'; 
import { FormGroup, FormControl, ReactiveFormsModule, Validators, ValidatorFn } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';


@Component({
  
  selector: 'app-create-course',
  imports: [CommonModule,ReactiveFormsModule ,FormsModule, Dialog, ButtonModule, InputTextModule, CalendarModule],
  standalone: true,
  templateUrl: './create-course.component.html',
})
export class CreateCourseComponent {
  
  visible: boolean = false;

  openModal() {
    this.visible = true; 
  }

  closeModal() {
    this.visible = false; 
  }
}
