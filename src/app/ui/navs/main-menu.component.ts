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
  ],
  templateUrl: './main-menu.component.html',
})
export class MainMenu implements OnInit {
  @ViewChild('createCourseModal') createCourseModal!: CreateCourseComponent;

  courses: any[] = [];
  visible: boolean = false;
  coursesVisible: boolean = false;
  transactionsVisible = false;
  employeesVisible = false;
  showCourses: boolean = false;

  items: MenuItem[] = [];
  home: MenuItem = { icon: 'pi pi-home', routerLink: '/' };

  constructor(
    private router: Router,
    private coursesService: CoursesService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.loadCourses();
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