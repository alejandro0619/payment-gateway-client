import { Component, OnInit, inject, PLATFORM_ID } from '@angular/core';
import { CommonModule } from '@angular/common';
;

import { ChartModule } from 'primeng/chart';


import { isPlatformBrowser } from '@angular/common';



@Component({
  selector: 'line-chart',
  standalone: true,
  imports: [
    CommonModule,
    ChartModule

  ],
  templateUrl: './line-chart.component.html',
})
export class LineChart implements OnInit {
  data: any;
  options: any;
  plaformId = inject(PLATFORM_ID);


  constructor(
  ) { }

  ngOnInit(): void {
    this.initChart()
  }

  initChart() {
    if (isPlatformBrowser(this.plaformId)) {

      this.data = {
        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
        datasets: [
          {
            label: 'molleja de pollo',
            backgroundColor: '#42A5F5',
            data: [0, 10, 5, 2, 20, 30, 45],
          },
        ],
      };
      this.options = {
        maintainAspectRatio: true,
      };
    }
  }
}