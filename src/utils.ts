import { EXTENSIONS } from './constants';

export function hasValidExtension(
  id: string,
  extensions: string[] = EXTENSIONS,
): boolean {
  return extensions.some((extension) => id.endsWith(extension));
}
