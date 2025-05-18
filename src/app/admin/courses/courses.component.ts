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
import { ModifyCoursesComponent } from './modify-courses.component';
import { CoursesService } from './courses.service';
import { TagModule } from 'primeng/tag';
import { MainMenu } from '../../ui/navs/main-menu.component';
import { Menu } from 'primeng/menu';
import { MessageService, ConfirmationService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { Course } from '../../global.types';

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
    MainMenu,
    Menu,
    ConfirmDialogModule,
    ToastModule,
    ModifyCoursesComponent,
  ],
  templateUrl: './courses.component.html',
  providers: [ConfirmationService, MessageService],
})
export class CoursesComponent implements OnInit {
  @ViewChild('createCourseModal') createCourseModal!: CreateCourseComponent;
  @ViewChild(ModifyCoursesComponent) modifyModal!: ModifyCoursesComponent;

  selectedCourse: Course | null = null;
  courses: Course[] = [];
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
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) { }

  ngOnInit() {
    this.loadCourses();
    this.setupMenuItems();
  }

  setupMenuItems() {
    this.items = [
      {
        label: 'Modificar curso',
        icon: 'pi pi-pencil',
        command: () => {
          this.openModifyModal();
        },
      },
      {
        label: 'Eliminar curso',
        icon: 'pi pi-trash',
        command: (event: { originalEvent: Event }) => {
          this.onDeleteCourse(event.originalEvent);
        },
      },
    ];
  }
  openModifyModal() {
    if (this.selectedCourse) {
      this.modifyModal.show();
    } else {
      this.messageService.add({
        severity: 'warn',
        summary: 'Advertencia',
        detail: 'Seleccione un curso primero',
      });
    }
  }


  onDeleteCourse(event: Event) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: '¿Está seguro de que desea eliminar este curso?',
      header: 'Confirmar eliminación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí, eliminar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-danger',
      rejectButtonStyleClass: 'p-button-secondary',
      accept: () => {
        this.coursesService.deleteCourse(this.selectedCourse!.id).subscribe({
          next: () => {
            this.loadCourses();
            this.messageService.add({
              severity: 'success',
              summary: 'Éxito',
              detail: `El curso ${this.selectedCourse!.name} fue eliminado satisfactoriamente`,
            });
          },
          error: (error) => {
            console.error('Error deleting course:', error);
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: `No se pudo eliminar el curso ${this.selectedCourse!.name}`,
            });
          },
        });
        this.selectedCourse = null;
      },
      reject: () => {
        this.messageService.add({
          severity: 'info',
          summary: 'Cancelado',
          detail: 'No se eliminó el curso',
        });
      },
    });
  }

  loadCourses() {
    this.loading = true;
    this.coursesService.getCourses().subscribe({
      next: (courses) => {
        this.courses = courses.map((course) => ({
          ...course,
          price: parseFloat(course.price).toFixed(2),
          createdAt: course.createdAt, // keep as string to match Course type
        }));
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading courses:', error);
      },
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
