import { Component, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { MenuItem } from 'primeng/api';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, TableModule, BreadcrumbModule],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit {
  
  items: MenuItem[] = [];
  home: MenuItem = { icon: 'pi pi-home', routerLink: '/' };

  products = [
    { code: 'P001', name: 'Product A', category: 'Category 1', quantity: 10 },
    { code: 'P002', name: 'Product B', category: 'Category 2', quantity: 20 },
    { code: 'P003', name: 'Product C', category: 'Category 3', quantity: 15 },
    { code: 'P004', name: 'Product D', category: 'Category 1', quantity: 25 },
    { code: 'P005', name: 'Product E', category: 'Category 2', quantity: 30 }
  ];

  menuOpen: boolean = false;

  constructor(private router: Router) {}

  ngOnInit() {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.updateBreadcrumb();
      }
    });

    // Breadcrumb inicial
    this.updateBreadcrumb();
  }

  updateBreadcrumb() {
    const segments = this.router.url.split('/').filter(segment => segment); 
    this.items = segments.map((segment, index) => {
      return {
        label: this.capitalize(segment.replace('-', ' ')), 
        routerLink: '/' + segments.slice(0, index + 1).join('/')
      };
    });
  }

  capitalize(text: string): string {
    return text.charAt(0).toUpperCase() + text.slice(1);
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  onProductClick(product: any) {
    console.log('Producto seleccionado:', product);
  }

  //menu
  @HostListener('document:click', ['$event'])
  closeMenuOnOutsideClick(event: Event) {
    if (!(event.target as HTMLElement).closest('.relative')) {
      this.menuOpen = false;
    }
  }
}
