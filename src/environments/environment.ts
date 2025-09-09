export const environment = {
  production: false,
  apiBaseUrl: 'http://localhost:8080/api',
  auth: {
    authority: 'http://localhost:9080/realms/hftm',
    clientId: 'angular-blog-app',
    redirectUrl: window.location.origin,
    postLogoutRedirectUri: window.location.origin,
    scope: 'openid profile email',
    responseType: 'code',
    silentRenew: true,
    useRefreshToken: true,
  },
};
