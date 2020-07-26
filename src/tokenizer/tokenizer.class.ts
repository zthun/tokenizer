import { readFile, writeFile } from 'fs';
import { chain } from 'lodash';
import { promisify } from 'util';
import { IZDictionaryReader } from '../dictionary-reader/dictionary-reader.interface';

/**
 * Represents the root application.
 */
export class ZTokenizer {
  /**
   * The console to write to.
   */
  public terminal: Console = console;

  /**
   * Initializes a new instance of this object.
   *
   * @param _inputFile The input file to replace tokens in.
   * @param _dictionaryReader The reader to retrieve the dictionary values.
   * @param _outputFile The output file to write to.  If this is omitted, then the console is used.
   */
  public constructor(private readonly _inputFile: string, private readonly _dictionaryReader: IZDictionaryReader, private readonly _outputFile?: string) {}

  /**
   * Runs the application.
   */
  public async run(): Promise<number> {
    const readFileAsync = promisify(readFile);
    const buffer = await readFileAsync(this._inputFile);
    const content = buffer.toString('utf-8');
    const variables = chain(content.match(/\${[A-Z_0-9\-.]+}/gim))
      .uniq()
      .value();

    const keys = variables.map((variable) => variable.replace('${', '').replace('}', ''));
    const dictionary = await this._dictionaryReader.read(keys);

    let replaced = content;
    variables.forEach((variable, i) => (replaced = replaced.split(variable).join(dictionary[keys[i]])));

    if (this._outputFile) {
      const writeFileAsync = promisify(writeFile);
      await writeFileAsync(this._outputFile, replaced);
    } else {
      this.terminal.log(replaced);
    }

    return 0;
  }
}
