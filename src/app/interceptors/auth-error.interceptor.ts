import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { AlertService } from '../services/alert.service';

/**
 * Interceptor funcional para la captura centralizada de errores HTTP
 * Cumple con el criterio de evaluación de respuesta visual ante errores 401 y 403 (Zero Trust)
 */
export const authErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const alertService = inject(AlertService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        alertService.error(
          '401 Unauthorized (No Autenticado)',
          'Tu token de sesión de Azure Entra ID es inexistente, inválido o ha expirado. Inicia sesión nuevamente.'
        );
      } else if (error.status === 403) {
        alertService.error(
          '403 Forbidden (Acceso Denegado por RBAC)',
          error.error?.message || 'Tu usuario autenticado no posee los roles (App Roles) o permisos necesarios para esta acción.'
        );
      } else if (error.status === 400) {
        const details = error.error?.details;
        let detailMsg = 'Los datos del pedido no cumplen las reglas de negocio del backend.';
        if (details) {
          detailMsg = Object.entries(details).map(([k, v]) => `${k}: ${v}`).join(' | ');
        }
        alertService.warning('400 Bad Request (Error de Validación)', detailMsg);
      } else if (error.status === 0) {
        alertService.error(
          'Error de Conexión (CORS / Network)',
          'No se pudo conectar con el microservicio en ' + req.url + '. Verifica que el backend esté ejecutándose en el puerto 8081 y que CORS permita tu origen.'
        );
      } else {
        alertService.error(
          `Error HTTP ${error.status}`,
          error.error?.message || error.message || 'Ocurrió un error inesperado en la comunicación Cloud.'
        );
      }

      return throwError(() => error);
    })
  );
};
