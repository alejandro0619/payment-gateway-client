import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-courses',
  imports: [CommonModule, CardModule, ButtonModule],
  templateUrl: './courses.component.html',
})
export class CoursesComponent {
  
}
