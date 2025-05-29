import { Component, OnInit, ChangeDetectorRef, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ChartModule } from 'primeng/chart';
import { ProgressBarModule } from 'primeng/progressbar';
import { TagModule } from 'primeng/tag';
import { AdminDashboardInfoService, PaymentMethod, TrxDashboard } from './admin-dashboard-info.service';



@Component({
  selector: 'app-payment-method-chart',
  templateUrl: './payment-method.component.html',
  standalone: true,
  imports: [ChartModule, ProgressBarModule, TagModule],
})
export class PaymentMethodChartComponent implements OnInit {
  constructor(private service: AdminDashboardInfoService) { }

  data: any;
  options: any;
  transactions: TrxDashboard[] = [];
  
  paymentMethods: PaymentMethod[] = []

  private platformId = inject(PLATFORM_ID);
  private cd = inject(ChangeDetectorRef);

  ngOnInit() {
    this.service.getDashboardInfo().subscribe(
      (data) => {
        console.log('Dashboard Info:', data);

        this.transactions = data.map(t => ({
          ...t,
          amount: parseFloat(t.amount.toString())
        }));

        this.initChart(); 
      },
      (error) => {
        console.error('Error al obtener la información del dashboard:', error);
      }
    );

    this.service.getPaymentMethodInfo().subscribe(
      (data) => {
        this.paymentMethods = data
        console.log('Payment Methods:', data);
      },
      (error) => {
        console.error('Error al obtener la información de los métodos de pago:', error);
      }
    );
  }

  private initChart() {
    if (isPlatformBrowser(this.platformId)) {
      const grouped = this.groupByDate(this.transactions);

      const labels = Object.keys(grouped);
      const dataPoints = Object.values(grouped);

      this.data = {
        labels,
        datasets: [
          {
            label: 'Monto por Fecha',
            data: dataPoints,
            fill: true,
            borderColor: '#42A5F5',
            tension: 0.4
          }
        ]
      };

      this.options = {
        responsive: false,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'top' },
          title: { display: true, text: 'Transacciones por Fecha' }
        },
        scales: {
          x: {
            title: { display: true, text: 'Fecha' }
          },
          y: {
            title: { display: true, text: 'Monto ($)' },
            beginAtZero: true
          }
        }
      };

      this.cd.detectChanges();
    }
  }

  private groupByDate(transactions: TrxDashboard[]): Record<string, number> {
    return transactions.reduce((acc, trx) => {
      const date = new Date(trx.createdAt).toLocaleDateString('es-VE');
      acc[date] = (acc[date] || 0) + trx.amount;
      return acc;
    }, {} as Record<string, number>);
  }
}
