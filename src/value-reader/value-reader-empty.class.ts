import { IZValueReader } from './value-reader.interface';

/**
 * Represents a value reader that resolves a variable to the empty string.
 */
export class ZValueReaderEmpty implements IZValueReader {
  /**
   * Resolves the empty string.
   *
   * @returns A promise that resolves the empty string.
   */
  public async read(): Promise<string> {
    return '';
  }
}
