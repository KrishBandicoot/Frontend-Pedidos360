export const environment = {
  production: false,
  apiUrl: 'https://eiru63rf9l.execute-api.us-east-1.amazonaws.com/dev/api/pedidos',
  apiBaseUrl: 'https://eiru63rf9l.execute-api.us-east-1.amazonaws.com/dev',
  azure: {
    // Client ID de la SPA registrada en Microsoft Entra ID
    clientId: '77fa1a53-496f-49d1-97d7-bac9b72d9081',
    // Tenant ID (Directorio)
    tenantId: '092500a8-a2b9-4d48-8ac2-1241d08e37c1',
    // Redirección tras autenticación con PKCE
    redirectUri: 'http://localhost:4200',
    // Scopes delegados expuestos por el Backend Web API
    scopes: [
      '77fa1a53-496f-49d1-97d7-bac9b72d9081/.default'
    ]
  }
};