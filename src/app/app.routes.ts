import { Routes } from '@angular/router';
import { ListaPedidosComponent } from './components/lista-pedidos/lista-pedidos.component';

export const routes: Routes = [
  { path: '', component: ListaPedidosComponent },
  { path: '**', redirectTo: '' }
];
