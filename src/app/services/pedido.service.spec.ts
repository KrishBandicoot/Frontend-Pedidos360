import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { PedidoService } from './pedido.service';
import { environment } from '../../environments/environment';

describe('PedidoService', () => {
  let service: PedidoService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        PedidoService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(PedidoService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('debe instanciarse correctamente', () => {
    expect(service).toBeTruthy();
  });

  it('debe obtener la lista de pedidos desde el backend REST', () => {
    const mockPedidos = [
      { id: 1, cliente: 'Cliente Test', estado: 'Pendiente' as const }
    ];

    service.getPedidos().subscribe(pedidos => {
      expect(pedidos.length).toBe(1);
      expect(pedidos[0].cliente).toBe('Cliente Test');
    });

    const req = httpMock.expectOne(environment.apiUrl);
    expect(req.request.method).toBe('GET');
    req.flush(mockPedidos);
  });
});
