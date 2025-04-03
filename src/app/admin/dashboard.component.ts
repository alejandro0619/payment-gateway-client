import { Component, OnInit, inject, PLATFORM_ID } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { Router } from '@angular/router';
import { DrawerModule } from 'primeng/drawer';
import { ButtonModule } from 'primeng/button';
import { AvatarModule } from 'primeng/avatar';

import { LineChart } from '../ui/charts/line-chart.component';
import { InsightCard } from '../ui/global/insight-card.component';
import { BarChart } from '../ui/charts/bar-chart.component';

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

    // custom comps
    LineChart,
    InsightCard,
    BarChart,
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