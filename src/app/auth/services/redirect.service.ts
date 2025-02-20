import { Injectable } from '@angular/core';
import  { Roles } from '../../global.types';
@Injectable({
  providedIn: 'root'
})
export class RedirectService {

  constructor() {  }

  redirect(rol: string): string {
    if (rol.toLocaleUpperCase() === Roles.ADMIN) {
      return '/admin/dashboard';
    } else if (rol.toLocaleUpperCase() === Roles.OPERATOR) {
      return '/operator/dashboard';
    } else if (rol.toLocaleUpperCase() === Roles.USER) {
      return '/user/dashboard';
    } else {
      return '/auth/login';
    }
  }
}
