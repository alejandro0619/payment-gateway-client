import { Router, ActivatedRoute } from '@angular/router';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RedirectDashboardGuard {
  constructor(private router: Router, private route: ActivatedRoute) { }

  redirectToDashboard(): void {
    // Obtiene la ruta actual
    const currentUrl = this.router.url;

    // Extrae el prefijo (primera parte de la ruta)
    const urlSegments = currentUrl.split('/').filter(segment => segment);
    const prefix = urlSegments.length > 0 ? urlSegments[0] : '';

    // Redirecciona al dashboard correspondiente
    if (prefix) {
      this.router.navigate([`/${prefix}/dashboard`]);
    } else {
      // Manejo de rutas sin prefijo (ej: página de login)
      this.router.navigate(['/login']); // Ajusta según tu estructura
    }
  }
}