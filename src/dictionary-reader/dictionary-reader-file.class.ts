import { readFile } from 'fs';
import { promisify } from 'util';
import { IZDictionaryReader, ZVariableDictionary } from './dictionary-reader.interface';

/**
 * Represents a dictionary reader that reads from a file.
 */
export class ZDictionaryReaderFile implements IZDictionaryReader {
  /**
   * Initializes a new instance of this object.
   *
   * @param file The path to the file to read.
   * @param fallback The fallback reader for keys that are missing from the file.
   */
  public constructor(public readonly file: string, public readonly fallback: IZDictionaryReader) {}

  /**
   * Gets the dictionary for the specified keys.
   *
   * Any keys that are missing from the JSON file will be retrieve by the fallback reader.
   *
   * @param keys The list of keys to retrieve.
   *
   * @returns the key dictionary.
   */
  public async read(keys: string[]): Promise<ZVariableDictionary> {
    const readFileAsync = promisify(readFile);
    const buffer = await readFileAsync(this.file);
    let dictionary: any = JSON.parse(buffer.toString('utf-8'));
    const missing = keys.filter((key) => !Object.prototype.hasOwnProperty.call(dictionary, key));

    if (missing.length) {
      const remaining = await this.fallback.read(missing);
      dictionary = Object.assign(dictionary, remaining);
    }

    return dictionary;
  }
}
