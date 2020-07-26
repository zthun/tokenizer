import { readFile } from 'fs';
import { promisify } from 'util';
import { IZDictionaryReader } from './dictionary-reader.interface';

/**
 * Represents a dictionary reader that reads from a file.
 */
export class ZDictionaryReaderFile implements IZDictionaryReader {
  /**
   * Initializes a new instance of this object.
   *
   * @param _file The path to the file to read.
   * @param _fallback The fallback reader for keys that are missing from the file.
   */
  public constructor(private readonly _file: string, private readonly _fallback: IZDictionaryReader) {}

  /**
   * Gets the dictionary for the specified keys.
   *
   * Any keys that are missing from the JSON file will be retrieve by the fallback reader.
   *
   * @param keys The list of keys to retrieve.
   *
   * @returns the key dictionary.
   */
  public async read(keys: string[]): Promise<{ [key: string]: string }> {
    const readFileAsync = promisify(readFile);
    const buffer = await readFileAsync(this._file);
    let dictionary = JSON.parse(buffer.toString('utf-8'));
    const missing = keys.filter((key) => !Object.prototype.hasOwnProperty.call(dictionary, key));

    if (missing) {
      const remaining = await this._fallback.read(missing);
      dictionary = Object.assign(dictionary, remaining);
    }

    return dictionary;
  }
}
