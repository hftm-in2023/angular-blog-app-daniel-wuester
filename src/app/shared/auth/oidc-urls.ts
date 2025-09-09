import { environment } from '../../../environments/environment';

export function isAuthServerUrl(url: string): boolean {
  try {
    const auth = new URL(environment.auth.authority); // z.B. http://localhost:9080/realms/hftm
    const baseOrigin = `${auth.protocol}//${auth.host}`; // -> http://localhost:9080
    return url.startsWith(baseOrigin);
  } catch {
    return false;
  }
}
