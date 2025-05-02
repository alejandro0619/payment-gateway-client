import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { IPayPalConfig, ICreateOrderRequest, NgxPayPalModule } from 'ngx-paypal';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { DashboardService } from '../../user/dashboard.service';


interface PaypalItemPayload {
  name: string;
  trx: string;
  description: string;
  price: number;
  currency: string;
  category: 'DIGITAL_GOODS' | string;
}

@Component({
  templateUrl: './paypal-button.component.html',
  selector: 'app-paypal-button',
  imports: [NgxPayPalModule, ToastModule],
  providers: [MessageService, DashboardService],
})
export class paypalBtn implements OnInit, OnChanges {

  constructor(private messageService: MessageService, private dashboardService: DashboardService) { }

  public payPalConfig?: IPayPalConfig;
  @Input() item: PaypalItemPayload | null = null;

  ngOnInit(): void {
    if (!this.item) return;
    this.initConfig();
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['item'] && changes['item'].currentValue) {
      this.initConfig();
    }
  }

  private initConfig(): void {
    if (!this.item) return;

    this.payPalConfig = {
      clientId: 'Af6hOBDQxe0CzRLzMJTALOVmycOumg2SyKoI4FBhWzxMvs0UlZsIxszHN8qRhY5lrwnQF51_zueyQG5V',
      createOrderOnClient: (data) => <ICreateOrderRequest>{
        intent: 'CAPTURE',
        fundingSource: 'PAYPAL',
        purchase_units: [
          {
            amount: {
              currency_code: this.item?.currency,
              value: this.item?.price.toString(),
              breakdown: {
                item_total: {
                  currency_code: this.item?.currency,
                  value: this.item?.price.toString()
                }
              }
            },
            items: [
              {
                name: this.item?.name,
                quantity: '1',
                category: this.item?.category,
                unit_amount: {
                  currency_code: this.item?.currency,
                  value: this.item?.price.toString()
                }
              }
            ]
          }
        ]
      },
      advanced: {
        commit: 'true',
        extraQueryParams: [{ name: 'disable-funding', value: 'card' }]
      },
      style: {
        label: 'pay',
        layout: 'vertical',
        fundingicons: false
      },
      onApprove: (data, actions) => {
        this.messageService.add({
          severity: 'info',
          summary: 'Transacción aprobada',
          detail: 'Procesando pago...',
          life: 3000
        });

        console.log('onApprove - transaction was approved, but not authorized', data, actions);
        actions.order.get().then((details: any) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Pago completado',
            detail: `Transacción ID: ${details.id}`,
            life: 5000
          });
          console.log('onApprove - you can get full order details inside onApprove: ', details);
        });
      },
      onClientAuthorization: (data) => {
        console.log('onClientAuthorization - you should probably inform your server about completed transaction at this point', data);
        this.dashboardService.autorizePayment(this.item!.trx, 'completed').subscribe({
          next: (response) => {
            console.log('Transacción autorizada:', response);
            this.messageService.add({
              severity: 'success',
              summary: 'Éxito',
              detail: 'Transacción autorizada con éxito'
            });
          },
          error: (error) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'No se pudo autorizar la transacción'
            });
          }
        });


      },
      onCancel: (data, actions) => {
        this.messageService.add({
          severity: 'warn',
          summary: 'Pago cancelado',
          detail: 'El proceso de pago fue cancelado',
          life: 3000
        });
        console.log('OnCancel', data, actions);
      },
      onError: err => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error en el pago',
          detail: err.message || 'Ocurrió un error durante el proceso',
          life: 5000
        });
        console.log('OnError', err);
      },
      onClick: (data, actions) => {
        console.log('onClick', data, actions);
      },
    };
  }
}
