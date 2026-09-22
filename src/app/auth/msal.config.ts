import {
  IPublicClientApplication,
  PublicClientApplication,
  BrowserCacheLocation,
  LogLevel,
  InteractionType
} from '@azure/msal-browser';
import { MsalGuardConfiguration, MsalInterceptorConfiguration } from '@azure/msal-angular';
import { environment } from '../../environments/environment';

export function loggerCallback(logLevel: LogLevel, message: string) {
  if (logLevel === LogLevel.Error) {
    console.error('[MSAL Error]', message);
  }
}

/**
 * Inicialización de PublicClientApplication con flujo PKCE (Proof Key for Code Exchange)
 * conectado a Microsoft Entra ID.
 */
export function MSALInstanceFactory(): IPublicClientApplication {
  return new PublicClientApplication({
    auth: {
      clientId: environment.azure.clientId,
      authority: `https://login.microsoftonline.com/${environment.azure.tenantId}`,
      redirectUri: environment.azure.redirectUri,
      postLogoutRedirectUri: environment.azure.redirectUri,
      navigateToLoginRequestUrl: true
    },
    cache: {
      cacheLocation: BrowserCacheLocation.LocalStorage,
      storeAuthStateInCookie: false // No usa cookies para asegurar cumplimiento stateless Zero Trust
    },
    system: {
      loggerOptions: {
        loggerCallback,
        logLevel: LogLevel.Warning,
        piiLoggingEnabled: false
      }
    }
  });
}

/**
 * Configuración del Guard de Protección de Rutas con MSAL
 */
export function MSALGuardConfigFactory(): MsalGuardConfiguration {
  const defaultScope = `${environment.azure.clientId}/.default`;
  return {
    interactionType: InteractionType.Popup,
    authRequest: {
      scopes: [defaultScope]
    }
  };
}

/**
 * Configuración del Interceptor para adjuntar automáticamente el Bearer Token
 * a las solicitudes dirigidas al Backend Pedidos360
 */
export function MSALInterceptorConfigFactory(): MsalInterceptorConfiguration {
  const protectedResourceMap = new Map<string, Array<string>>();
  const defaultScope = [`${environment.azure.clientId}/.default`];
  
  protectedResourceMap.set('http://localhost:8081/*', defaultScope);
  protectedResourceMap.set(environment.apiBaseUrl, defaultScope);
  protectedResourceMap.set(environment.apiUrl, defaultScope);

  return {
    interactionType: InteractionType.Popup,
    protectedResourceMap
  };
}
