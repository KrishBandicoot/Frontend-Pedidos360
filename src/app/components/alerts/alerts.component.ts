import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlertService } from '../../services/alert.service';

@Component({
  selector: 'app-alerts',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="alerts-container">
      @for (alert of alertService.alerts(); track alert.id) {
        <div class="alert-box" [ngClass]="alert.type">
          <div class="alert-icon">
            @if (alert.type === 'danger') { 🛑 }
            @else if (alert.type === 'warning') { ⚠️ }
            @else if (alert.type === 'success') { ✅ }
            @else { ℹ️ }
          </div>
          <div class="alert-content">
            <h4 class="alert-title">{{ alert.title }}</h4>
            <p class="alert-message">{{ alert.message }}</p>
          </div>
          <button class="alert-close" (click)="alertService.dismiss(alert.id)" title="Cerrar">&times;</button>
        </div>
      }
    </div>
  `,
  styles: [`
    .alerts-container {
      position: fixed;
      top: 80px;
      right: 24px;
      z-index: 9999;
      display: flex;
      flex-direction: column;
      gap: 12px;
      max-width: 480px;
      width: 100%;
    }
    .alert-box {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      padding: 14px 18px;
      border-radius: 8px;
      box-shadow: 0 4px 14px rgba(0,0,0,0.15);
      animation: slideIn 0.3s ease-out;
      background: white;
      border-left: 5px solid;
    }
    .alert-box.danger {
      border-color: #dc3545;
      background: #fff5f5;
      color: #842029;
    }
    .alert-box.warning {
      border-color: #ffc107;
      background: #fff9e6;
      color: #664d03;
    }
    .alert-box.success {
      border-color: #198754;
      background: #f0fdf4;
      color: #0f5132;
    }
    .alert-box.info {
      border-color: #0dcaf0;
      background: #f0f9ff;
      color: #055160;
    }
    .alert-icon {
      font-size: 1.3rem;
      line-height: 1;
    }
    .alert-content {
      flex: 1;
    }
    .alert-title {
      margin: 0 0 4px 0;
      font-size: 0.95rem;
      font-weight: 700;
    }
    .alert-message {
      margin: 0;
      font-size: 0.85rem;
      line-height: 1.4;
    }
    .alert-close {
      background: none;
      border: none;
      font-size: 1.3rem;
      cursor: pointer;
      color: inherit;
      opacity: 0.6;
      padding: 0 4px;
    }
    .alert-close:hover {
      opacity: 1;
    }
    @keyframes slideIn {
      from { transform: translateX(100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
  `]
})
export class AlertsComponent {
  alertService = inject(AlertService);
}
