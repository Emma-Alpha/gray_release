import { getConfigRoutes } from './routesConfig';
import type { IRoutesById } from './types';

export function winPath(path: string) {
  const isExtendedLengthPath = /^\\\\\?\\/.test(path);
  if (isExtendedLengthPath) {
    return path;
  }
  return path.replace(/\\/g, '/');
}

export function getRoutes(routes: IRoutesById[]) {
  let IRoutesById: any = null;

  IRoutesById = getConfigRoutes({ routes });

  return IRoutesById;
}
