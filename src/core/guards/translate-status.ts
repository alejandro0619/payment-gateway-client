import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class PaymentTranslationService {
  translatePaymentStatus(status: string): string {
    switch (status?.toLowerCase()) {
      case 'completed':
        return 'Completado';
      case 'in_process':
        return 'En proceso';
      case 'rejected':
        return 'Rechazado';
      case 'ready_to_be_checked':
        return 'Listo para ser revisado';
      default:
        return 'Desconocido';
    }
  }

  translatePaymentMethod(method: string): string {
    switch (method?.toLowerCase()) {
      case 'zelle':
        return 'Zelle';
      case 'paypal':
        return 'PayPal';
      default:
        return 'Pago interno';
    }
  }

  translatePaymentScheme(scheme: string): string {
    switch (scheme?.toLowerCase()) {
      case 'single_payment':
        return 'Pago único';
      case 'installments':
        return 'Pagos en cuotas';
      default:
        return 'Desconocido';
    }
  }

}
