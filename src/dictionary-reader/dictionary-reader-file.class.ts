import { readFile } from 'fs';
import { promisify } from 'util';
import { IZDictionaryReader } from './dictionary-reader.interface';

export class ZDictionaryReaderFile implements IZDictionaryReader {
  public constructor(private readonly _file: string, private readonly _fallback: IZDictionaryReader) {}

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
