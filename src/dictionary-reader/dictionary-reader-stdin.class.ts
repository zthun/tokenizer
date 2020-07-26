import { chain, identity } from 'lodash';
import { IZDictionaryReader } from './dictionary-reader.interface';

/**
 * Reads the dictionary from stdin.
 */
export class ZDictionaryReaderStdIn implements IZDictionaryReader {
  /**
   * Gets a value for a key.
   *
   * @param key The key to get the value for.
   *
   * @returns The raw text value of the key.
   */
  public valueFor(key: string): string {
    return key;
  }

  /**
   * Reads all key values from stdin.
   *
   * @param keys The keys to read.
   *
   * @return The dictionary to map key values.
   */
  public async read(keys: string[]): Promise<{ [key: string]: string }> {
    return chain(keys)
      .keyBy(identity)
      .mapValues((d) => this.valueFor(d))
      .value();
  }
}
