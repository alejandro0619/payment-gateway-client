// payment-method-chart.component.ts
import { Component, OnInit, ChangeDetectorRef, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ChartModule } from 'primeng/chart';

interface PaymentMethod {
  name: string;
  percentage: number;
  color: string;
  amount: number;
}

@Component({
  selector: 'app-payment-method-chart',
  templateUrl: './payment-method.component.html',
  standalone: true,
  imports: [ChartModule]
})
export class PaymentMethodChartComponent implements OnInit {
  data: any;
  options: any;
  paymentMethods: PaymentMethod[] = [
    {
      name: 'PayPal',
      percentage: 60,
      color: '#3B82F6',
      amount: 2910.00
    },
    {
      name: 'Tarjeta',
      percentage: 40,
      color: '#8B5CF6',
      amount: 727.50
    }
  ];

  private platformId = inject(PLATFORM_ID);
  private cd = inject(ChangeDetectorRef);

  ngOnInit() {
    this.initChart();
  }

  private initChart() {
    if (isPlatformBrowser(this.platformId)) {
      const documentStyle = getComputedStyle(document.documentElement);

      this.data = {
        labels: [''],
        datasets: this.paymentMethods.map(method => ({
          label: method.name,
          backgroundColor: method.color,
          data: [method.percentage]
        }))
      };

      this.options = {
        indexAxis: 'y',
        maintainAspectRatio: false,
        responsive: true,
        plugins: {
          legend: { display: true },
          tooltip: {
            callbacks: {
              label: (context: any) => {
                const method = this.paymentMethods[context.datasetIndex];
                return `${method.name}: ${method.percentage}% ($${method.amount.toFixed(2)})`;
              }
            }
          }
        },
        scales: {
          x: {
            stacked: true,
            max: 100,
            ticks: {
              color: documentStyle.getPropertyValue('--text-color-secondary'),
              callback: (value: any) => `${value}%`
            },

            grid: { display: false }
          },
          y: {
            stacked: true,
            display: true
          }
        }
      };

      this.cd.markForCheck();
    }
  }
}