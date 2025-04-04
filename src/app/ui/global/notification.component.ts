import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { SidebarModule } from 'primeng/sidebar';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [ButtonModule, SidebarModule, CommonModule],
  templateUrl: "./notification.component.html",
})
export class NotificationComponent {
  notificationsVisible = false;
  unreadCount = 3; // Contador de notificaciones no leídas

  // Datos de ejemplo para notificaciones
  notifications = [
    {
      id: 1,
      title: 'Nuevo mensaje',
      message: 'Tienes un nuevo mensaje de Juan Pérez',
      time: 'Hace 10 minutos',
      icon: 'pi pi-envelope',
      read: false
    },
    {
      id: 2,
      title: 'Pago recibido',
      message: 'Se ha procesado tu pago de $150.00',
      time: 'Hace 1 hora',
      icon: 'pi pi-dollar',
      read: false
    },
    {
      id: 3,
      title: 'Actualización del sistema',
      message: 'Nueva versión disponible (v2.3.1)',
      time: 'Ayer',
      icon: 'pi pi-cloud-download',
      read: true
    }
  ];

  toggleNotifications() {
    this.notificationsVisible = !this.notificationsVisible;
  }

  handleNotificationClick(notification: any) {
    if (!notification.read) {
      notification.read = true;
      this.unreadCount--;
    }
    // Aquí podrías añadir lógica para navegar a la acción correspondiente
  }

  markAllAsRead() {
    this.notifications.forEach(n => n.read = true);
    this.unreadCount = 0;
  }

  // Método para agregar notificaciones (ejemplo)
  addNotification() {
    const newNotification = {
      id: Date.now(),
      title: 'Nueva notificación',
      message: 'Esta es una notificación de prueba',
      time: 'Ahora',
      icon: 'pi pi-info-circle',
      read: false
    };
    this.notifications.unshift(newNotification);
    this.unreadCount++;
  }
}