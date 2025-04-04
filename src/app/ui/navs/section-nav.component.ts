// component.ts
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TreeSelect } from 'primeng/treeselect';

@Component({
    selector: 'app-section-navigator',
    templateUrl: './section-nav.component.html',
    standalone: true,
    imports: [FormsModule, TreeSelect]
})
export class SectionNavigatorComponent {
    navigationNodes = [
        {
            key: '1',
            label: 'Transacciones',
            data: 'transacciones',
            icon: 'pi pi-wallet'
        },
        {
            key: '2',
            label: 'Estudiantes',
            data: 'estudiantes',
            icon: 'pi pi-users'
        },
        {
            key: '3',
            label: 'Cursos',
            data: 'cursos',
            icon: 'pi pi-book'
        },
        {
            key: '4',
            label: 'Ganancias',
            data: 'ganancias',
            icon: 'pi pi-chart-line'
        }
    ];

    selectedNode: any;

    navigateToSection() {
        if (this.selectedNode && this.selectedNode.data) {
            try {
                const section = document.getElementById(this.selectedNode.data);
                if (section) {
                    section.scrollIntoView({ behavior: 'smooth' });
                    this.selectedNode = null; // Reset selection
                }
            } catch (e) {
                console.error('Error navigating to section:', e);
            }
        }
    }
}