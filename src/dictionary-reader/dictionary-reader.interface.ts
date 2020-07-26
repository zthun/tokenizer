/**
 * An object that can be used to retrieve the key-value dictionary.
 */
export interface IZDictionaryReader {
  /**
   * Reads in the values for the given keys.
   */
  read(keys: string[]): Promise<{ [key: string]: string }>;
}
