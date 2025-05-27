import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { MenuItem } from 'primeng/api';
import { Router } from '@angular/router';
import { DrawerModule } from 'primeng/drawer';
import { ButtonModule } from 'primeng/button';
import { Ripple } from 'primeng/ripple';
import { AvatarModule } from 'primeng/avatar';
import { CreateCourseComponent } from '../../../app/admin/courses/create-course.component';
import { CoursesService } from '../../../app/admin/courses/courses.service';
import { AuthService } from '../../../app/auth/services/auth.service';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { InputNumberModule } from 'primeng/inputnumber';
import { DialogModule } from 'primeng/dialog';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Company } from '../../global.types';

@Component({
  selector: 'main-menu',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    BreadcrumbModule,
    DrawerModule,
    ButtonModule,
    Ripple,
    AvatarModule,
    CreateCourseComponent,
    InputTextModule, 
    PasswordModule, 
    InputNumberModule, 
    DialogModule,
    ReactiveFormsModule,
  
  ],
  templateUrl: './main-menu.component.html',
})
  // CHECK FOR USEFFECT HOOK ANGULAR'S VERSION
export class MainMenu implements OnInit {
  @ViewChild('createCourseModal') createCourseModal!: CreateCourseComponent;
  displayDialog: boolean = false;
  configForm: FormGroup;

  courses: any[] = [];
  visible: boolean = false;
  coursesVisible: boolean = false;
  transactionsVisible = false;
  employeesVisible = false;
  showCourses: boolean = false;
  company: Company | null = null;
  items: MenuItem[] = [];
  home: MenuItem = { icon: 'pi pi-home', routerLink: '/' };

  constructor(
    private router: Router,
    private coursesService: CoursesService,
    private authService: AuthService,
    private fb: FormBuilder
  ) {
    const companyStr = localStorage.getItem('company');
    this.company = companyStr ? JSON.parse(companyStr) : null; // ??
    this.configForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      identificationNumber: [null, Validators.required],
      password: ['']
    });
  }

  
  ngOnInit() {
    this.loadCourses();
  }
  goToSignupAdmin() {
    console.log("Navigating to signup admin...");
    this.router.navigate(['auth/signup-admin']); 
  }
  goToDashboard() {
    console.log("Navigating to dashboard...");
    this.router.navigate(['admin/dashboard']); 
  }
  goToSignUpOperator(){
    console.log("Navigating to signUp-Operator...");
    this.router.navigate(['auth/signup-operator']); 
  }
  goToShowCourses(){
    console.log("Navigating to Courses...");
    this.router.navigate(['admin/courses']); 
  }
  goToTransactions(){
    console.log("Navigating to Transactions...");
    this.router.navigate(['admin/transactions']); 
  }
  goToEmployees(){
    console.log("Navigating to Employees...");
    this.router.navigate(['admin/employees']); 
  }
  loadCourses() {
    this.coursesService.getCourses().subscribe({
      next: (courses) => {
        this.courses = courses.map(course => ({
          ...course,
          price: parseFloat(course.price).toFixed(2),
          createdAt: new Date(course.createdAt)
        }));
        console.log('Courses loaded:', this.courses);
      },
      error: (error) => {
        console.error('Error loading courses:', error);
      }
    });
  }
   mostrarModal() {
    this.displayDialog = true;
  }

  logout() {
    this.authService.logout().subscribe({
      next: () => {
        console.log('Logout successful');
      },
      error: (error) => {
        console.error('Logout error:', error);
      }
    });

  }
  openCreateCourseModal() {
    this.createCourseModal.openModal();
  }

  closeCallback(event: Event) {
    this.visible = false;
  }

  capitalize(text: string): string {
    return text.charAt(0).toUpperCase() + text.slice(1);
  }
}