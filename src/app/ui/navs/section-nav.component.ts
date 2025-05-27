import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TreeSelect } from 'primeng/treeselect';
import { Router } from '@angular/router';

@Component({
    selector: 'app-section-navigator',
    templateUrl: './section-nav.component.html',
    standalone: true,
    imports: [FormsModule, TreeSelect]
})
export class SectionNavigatorComponent {
    selectedNode: any;

    constructor(private router: Router) {}

    navigationNodes = [
        {
            key: '1',
            label: 'Transacciones',
            data: 'admin/transactions',
            icon: 'pi pi-wallet'
        },
        {
            key: '2',
            label: 'Estudiantes',
            data: 'admin/students',
            icon: 'pi pi-users'
        },
        {
            key: '3',
            label: 'Cursos',
            data: 'admin/courses',
            icon: 'pi pi-book'
        },
        {
            key: '4',
            label: 'Empleados',
            data: 'admin/employees',
            icon: 'pi pi-chart-line'
        }
    ];

    navigateToSection(node: any) {
        if (node?.data) {
            this.router.navigate([`/${node.data}`]);
        }
    }
}
