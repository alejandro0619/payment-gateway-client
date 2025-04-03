import { isPlatformBrowser } from '@angular/common';
import { ChangeDetectorRef, Component, effect, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { ChartModule } from 'primeng/chart';

@Component({
    selector: 'bar-chart',
    templateUrl: './bar-chart.component.html',
    standalone: true,
    imports: [ChartModule]
})
export class BarChart implements OnInit {
    basicData: any;

    basicOptions: any;

    platformId = inject(PLATFORM_ID);

    constructor(private cd: ChangeDetectorRef) {}


    ngOnInit() {
        this.initChart();
    }

    initChart() {
        if (isPlatformBrowser(this.platformId)) {
            const documentStyle = getComputedStyle(document.documentElement);
            const textColor = documentStyle.getPropertyValue('--p-text-color');
            const textColorSecondary = documentStyle.getPropertyValue('--p-text-muted-color');
            const surfaceBorder = documentStyle.getPropertyValue('--p-content-border-color');

            this.basicData = {
                labels: ['Q1', 'Q2', 'Q3', 'Q4'],
                datasets: [
                    {
                        label: 'Sales',
                        data: [540, 325, 702, 620],
                        backgroundColor: [
                            'rgba(249, 115, 22, 1)',
                            'rgba(6, 182, 212, 1)',
                            'rgb(107, 114, 128, 1)',
                            'rgba(139, 92, 246, 1)',
                    ],
                    },
                ],
            };

            this.basicOptions = {
            };
        }
    }
}