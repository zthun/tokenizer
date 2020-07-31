import { mkdir, writeFile } from 'fs';
import { promisify } from 'util';
import { ZVariableDictionary } from '../dictionary-reader/dictionary-reader.interface';
import { IZDictionaryExporter } from './dictionary-exporter.interface';
import { dirname } from 'path';

/**
 * Represents an exporter that writes a json file.
 */
export class ZDictionaryExporterJson implements IZDictionaryExporter {
  private readonly _writeFileAsync = promisify(writeFile);
  private readonly _mkdirAsync = promisify(mkdir);

  /**
   * Pretty print spacing.
   */
  public static readonly JSON_SPACING = 2;

  /**
   * Initializes a new instance of this object.
   *
   * @param path The fully qualified path to the JSON file to output.
   */
  public constructor(public readonly path: string) {}

  /**
   * Writes the dictionary to a file.
   *
   * @param dictionary The dictionary to write.
   *
   * @returns A promise that resolves once the dictionary has been written.
   */
  public async write(dictionary: ZVariableDictionary): Promise<void> {
    const buffer = JSON.stringify(dictionary, null, ZDictionaryExporterJson.JSON_SPACING);
    const dir = dirname(this.path);
    await this._mkdirAsync(dir, { recursive: true });
    await this._writeFileAsync(this.path, buffer);
  }
}
