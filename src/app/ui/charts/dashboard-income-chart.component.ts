// dashboard-income-chart.component.ts
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ChartModule } from 'primeng/chart';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';
import { Button } from 'primeng/button';
interface DataTimeframe {
  name: string;
  code: string;
}

@Component({
  selector: 'dashboard-income-chart',
  standalone: true,
  imports: [
    CommonModule,
    ChartModule,
    DropdownModule,
    FormsModule,
    Button
  ],
  templateUrl: './dashboard-income-chart.component.html',
})
export class DashboardIncomeChartComponent implements OnInit {
  dataTimeframes: DataTimeframe[] = [
    { name: 'Últimos 7 días', code: '7d' },
    { name: 'Último mes', code: '1m' },
    { name: 'Último año', code: '1y' },
    { name: 'Todo el tiempo', code: 'all' }
  ];

  selectedTimeframe!: DataTimeframe;
  data!: any;
  options!: any;

  constructor() {
    this.selectedTimeframe = this.dataTimeframes[0];
  }

  ngOnInit() {
    this.updateChart();
  }

  updateChart() {
    const { labels, data } = this.generateChartData();
    
    this.data = {
      labels: labels,
      datasets: [
        {
          label: 'Ingresos',
          data: data,
          fill: false,
          borderColor: '#3B82F6',
          tension: 0.4,
          borderWidth: 2,
          pointRadius: 3,
          pointBackgroundColor: '#3B82F6'
        }
      ]
    };

    this.options = this.getChartOptions();
  }

  private generateChartData() {
    switch(this.selectedTimeframe.code) {
      case '7d':
        return {
          labels: this.getLast7DaysLabels(),
          data: this.generateRandomData(7, 1000, 5000)
        };
      case '1m':
        return {
          labels: this.getLastMonthLabels(),
          data: this.generateRandomData(4, 5000, 20000)
        };
      case '1y':
        return {
          labels: this.getMonthNames(),
          data: this.generateRandomData(12, 10000, 50000)
        };
      case 'all':
      default:
        return {
          labels: ['2020', '2021', '2022', '2023'],
          data: this.generateRandomData(4, 50000, 150000)
        };
    }
  }

  private getChartOptions() {
    return {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: { display: true, },
        tooltip: {
          backgroundColor: '#1F2937',
          titleColor: '#F9FAFB',
          bodyColor: '#F9FAFB'
        }
      },
      scales: {
        x: {
          grid: { color: '#E5E7EB' }
        },
        y: {
          grid: { color: '#E5E7EB' },
          ticks: {
            callback: (value: number) => `$${value.toLocaleString()}`
          }
        }
      }
    };
  }

  // Helpers para generación de datos
  private getLast7DaysLabels(): string[] {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      days.push(date.toLocaleDateString('es-ES', { weekday: 'short' }));
    }
    return days;
  }

  private getLastMonthLabels(): string[] {
    return ['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4'];
  }

  private getMonthNames(): string[] {
    return ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
  }

  private generateRandomData(count: number, min: number, max: number): number[] {
    return Array.from({ length: count }, () => 
      Math.floor(Math.random() * (max - min + 1)) + min
    );
  }
}