import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { from, switchMap, catchError } from 'rxjs';
import { MsalService } from '@azure/msal-angular';
import { environment } from '../../environments/environment';

/**
 * Interceptor funcional que inyecta automáticamente el token JWT Bearer
 * obtenido de Microsoft Entra ID con flujo PKCE
 */
export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  const msalService = inject(MsalService);

  // Solo inyectar token a peticiones hacia nuestro backend
  if (!req.url.startsWith(environment.apiBaseUrl) && !req.url.startsWith(environment.apiUrl)) {
    return next(req);
  }

  const account = msalService.instance.getActiveAccount() || msalService.instance.getAllAccounts()[0];

  if (!account) {
    // Si no hay cuenta autenticada, enviamos la petición tal cual (el backend responderá 401 si requiere auth)
    return next(req);
  }

  const defaultScope = `${environment.azure.clientId}/.default`;

  return from(
    msalService.instance.acquireTokenSilent({
      account,
      scopes: [defaultScope]
    })
  ).pipe(
    switchMap(tokenResult => {
      const authReq = req.clone({
        setHeaders: {
          Authorization: `Bearer ${tokenResult.accessToken}`
        }
      });
      return next(authReq);
    }),
    catchError((err) => {
      console.warn('Fallo acquireTokenSilent en tokenInterceptor:', err);
      return next(req);
    })
  );
};
