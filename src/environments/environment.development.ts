export const environment = {
  production: true,
  apiBaseUrl: 'https://d-cap-blog-backend---v2.whitepond-b96fee4b.westeurope.azurecontainerapps.io',
  auth: {
    authority: 'http://localhost:8080/auth/realms/hftm/',
    clientId: 'angular-blog-app',
    redirectUrl: window.location.origin,
    postLogoutRedirectUri: window.location.origin,
    scope: 'openid profile email',
    responseType: 'code',
    silentRenew: true,
    useRefreshToken: true,
  },
};
