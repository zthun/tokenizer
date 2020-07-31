import { IZTokenReplacer } from './token-replacer.interface';
import { join, dirname } from 'path';
import { promisify } from 'util';
import { readFile, writeFile, mkdir } from 'fs';
import { ZVariableDictionary } from '../dictionary-reader/dictionary-reader.interface';

/**
 * Represents a replacer that writes tokenized replaced files to an output directory.
 */
export class ZTokenReplacerFiles implements IZTokenReplacer {
  private readonly _readFileAsync = promisify(readFile);
  private readonly _writeFileAsync = promisify(writeFile);
  private readonly _mkdirAsync = promisify(mkdir);

  /**
   * Initializes a new instance of this object.
   *
   * @param output The fully qualified path to the output directory.
   * @param cwd The fully qualified path to the current working directory.
   */
  public constructor(public readonly output: string, public readonly cwd: string) {}

  /**
   * Loops through all files and replaces all variables in that file.
   *
   * @param files The files to perform replacements on.
   * @param variables The variables to replace.
   * @param dictionary The dictionary that contains the key value pairs for replacement.
   *
   * @returns A promise that resolves when all files have been written.  Rejects is any file fails to write.
   */
  public async write(files: string[], variables: string[], dictionary: ZVariableDictionary): Promise<void> {
    for (const file of files) {
      const outputPath = join(this.output, file.replace(this.cwd, ''));
      const parent = dirname(outputPath);
      const buffer = await this._readFileAsync(file);

      let replaced = buffer.toString('utf-8');

      for (const variable of variables) {
        const key = variable.replace('${', '').replace('}', '');
        replaced = replaced.split(variable).join((dictionary[key] ?? variable).toString());
      }

      await this._mkdirAsync(parent, { recursive: true });
      await this._writeFileAsync(outputPath, replaced);
    }
  }
}
