import { IZValueReader } from './value-reader.interface';

/**
 * Represents a value reader that resolves a variable back to a variable.
 */
export class ZValueReaderKeep implements IZValueReader {
  /**
   * Resolves to the variable format of key.
   *
   * @returns A promise that resolves to ${key}
   */
  public async read(key: string): Promise<string> {
    return `\${${key}}`;
  }
}
