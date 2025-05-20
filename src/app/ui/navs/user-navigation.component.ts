import { Component, Input } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { MenubarModule } from 'primeng/menubar';
import { MenuModule } from 'primeng/menu';
import { AuthService } from '../../auth/services/auth.service';
@Component({
  selector: 'user-navigation',
  imports: [MenubarModule, MenuModule],
  standalone: true,
  templateUrl: './user-navigation.component.html',
  styleUrls: ['./user-navigation.component.css'],
})
export class UserNavigationComponent {
  constructor(private authService: AuthService) { }

  @Input() balance: number = 0; // User balance

  items: MenuItem[] = [


    {
      label: 'Perfil',
      icon: 'pi pi-user',
      items: [
        {
          label: 'Configuración',
          icon: 'pi pi-cog'
        },
        {
          label: 'Cerrar sesión',
          icon: 'pi pi-sign-out',
          command: () => this.logout()
        },
      ]
    },
    {
      label: 'Histórico de pagos',
      icon: 'pi pi-clock'
    },
  ];




  logout() {
    this.authService.logout().subscribe({
      next: () => {
        console.log('Logout successful');
      },
      error: (error) => {
        console.error('Logout error:', error);
      }
    });

  }
}