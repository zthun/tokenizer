/**
 * A dictionary where ever string key is a string value.
 */
export type ZVariableDictionary = { [key: string]: string | number | boolean };

/**
 * An object that can be used to retrieve the key-value dictionary.
 */
export interface IZDictionaryReader {
  /**
   * Reads in the values for the given keys.
   */
  read(keys: string[]): Promise<ZVariableDictionary>;
}
