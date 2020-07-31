import { ZVariableDictionary } from '../dictionary-reader/dictionary-reader.interface';

/**
 * Represents an object that can be used to export a dictionary.
 */
export interface IZDictionaryExporter {
  /**
   * Exports the dictionary.
   *
   * @param dictionary The dictionary to export.
   *
   * @returns A promise that resolves when the dictionary
   */
  write(dictionary: ZVariableDictionary): Promise<void>;
}
