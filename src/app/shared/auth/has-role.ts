export function hasRole(userData: any, role: string): boolean {
  if (!userData) return false;

  const realmRoles: string[] = userData?.realm_access?.roles ?? [];

  const clientRoles: string[] = Object.values(userData?.resource_access ?? {}).flatMap(
    (r: any) => r?.roles ?? [],
  );

  return [...realmRoles, ...clientRoles].includes(role);
}
