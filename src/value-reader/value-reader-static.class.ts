import { IZValueReader } from './value-reader.interface';

/**
 * Represents a value reader that resolves a variable to a static value
 */
export class ZValueReaderStatic implements IZValueReader {
  /**
   * Initializes a new instance of this object.
   *
   * @param value The static value to return.
   */
  public constructor(public value: string | number | boolean) {}

  /**
   * Resolves the empty string.
   *
   * @returns A promise that resolves the empty string.
   */
  public async read(): Promise<string | number | boolean> {
    return this.value;
  }
}
