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
import { CreateCourseComponent } from './courses/create-course.component';
import { CoursesComponent } from './courses/courses.component';
import { DashboardService } from './dashboard.service';
import { parse } from 'path';

@Component({
  selector: 'app-dashboard',
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
    CoursesComponent
  ],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit {
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
    private dashboardService : DashboardService
  ) {}

  ngOnInit() {
    this.loadCourses();
  }

  loadCourses() {
    this.dashboardService.getCourses().subscribe({
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