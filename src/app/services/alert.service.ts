import { Injectable, signal } from '@angular/core';

export interface AlertMessage {
  id: number;
  type: 'danger' | 'warning' | 'success' | 'info';
  title: string;
  message: string;
  timestamp: Date;
}

@Injectable({
  providedIn: 'root'
})
export class AlertService {
  private counter = 0;
  readonly alerts = signal<AlertMessage[]>([]);

  show(type: AlertMessage['type'], title: string, message: string): void {
    const id = ++this.counter;
    const newAlert: AlertMessage = { id, type, title, message, timestamp: new Date() };
    this.alerts.update(list => [...list, newAlert]);

    // Auto-eliminar después de 7 segundos
    setTimeout(() => this.dismiss(id), 7000);
  }

  error(title: string, message: string): void {
    this.show('danger', title, message);
  }

  warning(title: string, message: string): void {
    this.show('warning', title, message);
  }

  success(title: string, message: string): void {
    this.show('success', title, message);
  }

  info(title: string, message: string): void {
    this.show('info', title, message);
  }

  dismiss(id: number): void {
    this.alerts.update(list => list.filter(a => a.id !== id));
  }

  clear(): void {
    this.alerts.set([]);
  }
}
