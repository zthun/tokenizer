/**
 * Converts str to base 64.
 *
 * @param str The string to convert.
 *
 * @returns The base64 string.
 */
export function str2base64(str: string): string {
  return Buffer.from(str).toString('base64');
}
