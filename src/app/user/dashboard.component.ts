import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BreadcrumbModule } from 'primeng/breadcrumb';
import { DrawerModule } from 'primeng/drawer';
import { ButtonModule } from 'primeng/button';
import { AvatarModule } from 'primeng/avatar';
import { MessageService } from 'primeng/api';



@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, BreadcrumbModule, DrawerModule, ButtonModule, AvatarModule],
  templateUrl: './dashboard.component.html',
  providers:[MessageService]
})
export class DashboardComponent {
  
  
}
