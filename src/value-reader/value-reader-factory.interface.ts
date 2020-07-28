import { IZValueReader } from './value-reader.interface';
import { ZValueStrategy } from './value-strategy.enum';

/**
 * Represents a factory to construct value reader objects.
 */
export interface IZValueReaderFactory {
  /**
   * Creates a value reader.
   *
   * @param strategy The strategy to use to create the reader.
   *
   * @returns A new value reader that conforms to the specified strategy.
   */
  create(strategy: ZValueStrategy): IZValueReader;

  /**
   * Gets the default value reader.
   *
   * @returns The default value reader.
   */
  default(): IZValueReader;
}
