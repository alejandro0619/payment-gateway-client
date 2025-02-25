import { Component, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { MenuItem } from 'primeng/api';
import { Router, NavigationEnd } from '@angular/router';
import { ViewChild } from '@angular/core';
import { DrawerModule } from 'primeng/drawer';
import { ButtonModule } from 'primeng/button';
import { Ripple } from 'primeng/ripple';
import { AvatarModule } from 'primeng/avatar';
import { StyleClass } from 'primeng/styleclass';
import { Drawer } from 'primeng/drawer';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, TableModule, BreadcrumbModule, DrawerModule, ButtonModule, Ripple, AvatarModule ],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent  {

  visible: boolean = false;
  coursesVisible: boolean = false; 
  transactionsVisible = false; 
  employeesVisible = false; 

  closeCallback(event: Event) {
    this.visible = false;
  }

 
    
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

  capitalize(text: string): string {
    return text.charAt(0).toUpperCase() + text.slice(1);
  }

  onProductClick(product: any) {
    console.log('Producto seleccionado:', product);
  }

  
}
