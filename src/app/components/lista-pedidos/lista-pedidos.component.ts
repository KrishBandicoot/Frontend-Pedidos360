import { Component, OnInit, inject, signal, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PedidoService } from '../../services/pedido.service';
import { AuthService } from '../../services/auth.service';
import { AlertService } from '../../services/alert.service';
import { Pedido, NuevoPedido } from '../../models/pedido.model';

@Component({
  selector: 'app-lista-pedidos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './lista-pedidos.component.html',
  styleUrl: './lista-pedidos.component.css'
})
export class ListaPedidosComponent implements OnInit {
  pedidoService = inject(PedidoService);
  authService = inject(AuthService);
  alertService = inject(AlertService);

  readonly pedidos = signal<Pedido[]>([]);
  readonly loading = signal<boolean>(false);

  nuevoPedido: NuevoPedido = {
    cliente: '',
    estado: 'Pendiente'
  };

  // Métricas para el Dashboard
  readonly totalPedidos = computed(() => this.pedidos().length);
  readonly pedidosPendientes = computed(() => this.pedidos().filter(p => p.estado === 'Pendiente').length);
  readonly pedidosPreparacion = computed(() => this.pedidos().filter(p => p.estado === 'En Preparacion').length);
  readonly pedidosCompletados = computed(() => this.pedidos().filter(p => p.estado === 'Completado').length);

  constructor() {
    effect(() => {
      if (this.authService.isAuthenticated()) {
        this.cargarPedidos();
      }
    });
  }

  ngOnInit(): void {
    if (this.authService.isAuthenticated()) {
      this.cargarPedidos();
    }
  }

  cargarPedidos(): void {
    this.loading.set(true);
    this.pedidoService.getPedidos().subscribe({
      next: (data) => {
        this.pedidos.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      }
    });
  }

  crearPedido(): void {
    if (!this.nuevoPedido.cliente.trim() || this.nuevoPedido.cliente.trim().length < 3) {
      this.alertService.warning(
        'Validación Frontend',
        'El nombre del cliente debe contener al menos 3 caracteres.'
      );
      return;
    }

    this.pedidoService.crearPedido(this.nuevoPedido).subscribe({
      next: (creado) => {
        this.pedidos.update(list => [...list, creado]);
        this.alertService.success(
          'Pedido Registrado',
          `Pedido #${creado.id} para "${creado.cliente}" guardado en la base de datos.`
        );
        this.nuevoPedido = { cliente: '', estado: 'Pendiente' };
      },
      error: (err) => {
        console.error('Error al crear pedido:', err);
      }
    });
  }

  eliminarPedido(id: number): void {
    if (!confirm(`¿Confirmas eliminar el pedido #${id}? Esta operación requiere rol ADMIN en Azure Entra ID.`)) {
      return;
    }

    this.pedidoService.eliminarPedido(id).subscribe({
      next: () => {
        this.pedidos.update(list => list.filter(p => p.id !== id));
        this.alertService.success('Eliminado', `El pedido #${id} fue eliminado con éxito (204 No Content).`);
      },
      error: (err) => {
        console.error('Error al eliminar:', err);
      }
    });
  }
}
