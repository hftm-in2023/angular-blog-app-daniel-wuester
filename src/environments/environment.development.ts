export const environment = {
  production: false,
  apiBase: '/api',
  serviceUrl: '/api',
  auth: {
    authority:
      'https://d-cap-keyclaok.kindbay-711f60b2.westeurope.azurecontainerapps.io/realms/blog',
    redirectUrl: window.location.origin,
    postLogoutRedirectUri: window.location.origin,
    clientId: 'spa-blog',
    scope: 'openid profile email offline_access',
    responseType: 'code',
    silentRenew: false,
    silentRenewUrl: window.location.origin + '/silent-renew.html',
    renewTimeBeforeTokenExpiresInSeconds: 10,
  },
};
