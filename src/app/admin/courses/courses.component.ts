import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { MenuItem } from 'primeng/api';
import { Router } from '@angular/router';
import { DrawerModule } from 'primeng/drawer';
import { ButtonModule } from 'primeng/button';
import { Ripple } from 'primeng/ripple';
import { AvatarModule } from 'primeng/avatar';
import { CreateCourseComponent } from './create-course.component';
import { CoursesService } from './courses.service';
import { TagModule } from 'primeng/tag';
import { MainMenu } from '../../ui/navs/main-menu.component';


@Component({
  selector: 'app-courses',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    BreadcrumbModule,
    DrawerModule,
    ButtonModule,
    AvatarModule,
    TagModule,
    MainMenu
    
],
  templateUrl: './courses.component.html',
})
export class CoursesComponent implements OnInit {
  @ViewChild('createCourseModal') createCourseModal!: CreateCourseComponent;

  courses: any[] = [];
  visible: boolean = false;
  coursesVisible: boolean = false;
  transactionsVisible = false;
  employeesVisible = false;
  showCourses: boolean = false;

  items: MenuItem[] = [];
  home: MenuItem = { icon: 'pi pi-home', routerLink: '/' };

  // This state here is to show the loading spinner when the data is being fetched
  loading: boolean = false;

  constructor(
    private router: Router,
    private coursesService: CoursesService,
  ) { }

  ngOnInit() {
    this.loadCourses();
  }


  loadCourses() {
    this.loading = true;
    this.coursesService.getCourses().subscribe({
      next: (courses) => {
        this.courses = courses.map(course => ({
          ...course,
          price: parseFloat(course.price).toFixed(2),
          createdAt: new Date(course.createdAt)
        }));
        this.loading = false;
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