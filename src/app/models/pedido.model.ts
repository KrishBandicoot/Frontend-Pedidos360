export interface Pedido {
  id: number;
  cliente: string;
  estado: 'Pendiente' | 'En Preparacion' | 'Completado';
  fechaCreacion?: string;
}

export interface NuevoPedido {
  cliente: string;
  estado: 'Pendiente' | 'En Preparacion' | 'Completado';
}

export interface ApiErrorResponse {
  timestamp: string;
  status: number;
  error: string;
  message?: string;
  details?: Record<string, string>;
}
