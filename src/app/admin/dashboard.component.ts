import { Component, OnInit, inject, PLATFORM_ID } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { Router } from '@angular/router';
import { DrawerModule } from 'primeng/drawer';
import { ButtonModule } from 'primeng/button';
import { AvatarModule } from 'primeng/avatar';

import { SectionNavigatorComponent } from '../ui/navs/section-nav.component';
import { MainMenu } from '../ui/navs/main-menu.component';
import { NotificationComponent } from '../ui/global/notification.component';
import { DashboardIncomeChartComponent } from '../ui/charts/dashboard-income-chart.component';
import { PaymentMethodChartComponent } from '../ui/charts/payment-method.component';
import { InsightCard } from "../ui/global/insight-card.component";
import { TransactionsTableComponent } from '../ui/tables/transaction-dashboard.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    BreadcrumbModule,
    DrawerModule,
    ButtonModule,
    AvatarModule,
    PaymentMethodChartComponent,
    DashboardIncomeChartComponent,
    SectionNavigatorComponent,
    MainMenu,
    InsightCard,
    TransactionsTableComponent,
    
  ],
  
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit {
  data: any;
  options: any;
  plaformId = inject(PLATFORM_ID);


  constructor(
    private router: Router,
  ) { }
  
  ngOnInit(): void {

  }

}