import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { ListaPedidosComponent } from './lista-pedidos.component';
import { PedidoService } from '../../services/pedido.service';
import { AuthService } from '../../services/auth.service';
import { AlertService } from '../../services/alert.service';

describe('ListaPedidosComponent', () => {
  let component: ListaPedidosComponent;
  let fixture: ComponentFixture<ListaPedidosComponent>;
  let pedidoServiceMock: jasmine.SpyObj<PedidoService> | any;
  let authServiceMock: any;

  beforeEach(async () => {
    pedidoServiceMock = {
      getPedidos: () => of([
        { id: 1, cliente: 'Empresa Alpha', estado: 'Pendiente' }
      ]),
      crearPedido: () => of({ id: 2, cliente: 'Empresa Beta', estado: 'Completado' }),
      eliminarPedido: () => of(void 0)
    };

    authServiceMock = {
      isAuthenticated: () => true,
      userName: () => 'Profesor DSY1107',
      userEmail: () => 'profesor@duoc.cl',
      roles: () => ['Admin'],
      isAdmin: () => true,
      hasRole: (role: string) => role === 'Admin'
    };

    await TestBed.configureTestingModule({
      imports: [ListaPedidosComponent],
      providers: [
        { provide: PedidoService, useValue: pedidoServiceMock },
        { provide: AuthService, useValue: authServiceMock },
        AlertService
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ListaPedidosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debe crear el componente de pedidos', () => {
    expect(component).toBeTruthy();
  });

  it('debe cargar los pedidos iniciales en la tabla', () => {
    expect(component.pedidos().length).toBe(1);
    expect(component.pedidos()[0].cliente).toBe('Empresa Alpha');
  });
});
