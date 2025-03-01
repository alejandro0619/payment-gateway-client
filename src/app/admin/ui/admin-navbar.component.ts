import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // Importa CommonModule

@Component({
  selector: 'app-admin-navbar',
  templateUrl: './admin-navbar.component.html',

  imports: [CommonModule], // Importa CommonModule aquí
})
export class AdminNavbarComponent {
  dropdownStates: { [key: string]: boolean } = {
    users: false,
    courses: false,
  };

  toggleDropdown(menu: string) {
    this.dropdownStates[menu] = !this.dropdownStates[menu];
  }

  closeDropdown(menu: string) {
    this.dropdownStates[menu] = false;
  }

  isDropdownOpen(menu: string): boolean {
    return this.dropdownStates[menu];
  }
}