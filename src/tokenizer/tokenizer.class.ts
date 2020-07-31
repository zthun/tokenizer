import chalk from 'chalk';
import { readFile } from 'fs';
import { sync } from 'glob';
import { chain } from 'lodash';
import { promisify } from 'util';
import { IZTokenizerOptions } from './tokenizer-options.interface';

/**
 * Represents the root application.
 */
export class ZTokenizer {
  public static readonly WarningNoGlobsProvided = chalk.yellow('No globs were provided.  Check your files option in your tokenizer config file or pass the globs on the command line.');
  public static readonly WarningNoFilesFound = chalk.yellow('No files found to process');
  public static readonly WarningNoVariablesFound = chalk.yellow('No variables were found in any of the discovered files.  A one to one copy of every file will be made with no changes.');

  private _readFileAsync = promisify(readFile);

  /**
   * Initializes a new instance of this object.
   *
   * @param options The application options.
   */
  public constructor(private readonly _options: IZTokenizerOptions) {}

  /**
   * Runs the application.
   *
   * @returns A promise that resolves to 0 if the application successfully processed everything it needed to, or 1 if it failed.
   */
  public async run(): Promise<number> {
    try {
      const files = await this._expandGlobs();

      if (!files.length) {
        return 0;
      }

      const variables = await this._findVariables(files);
      const keys = variables.map((variable) => variable.replace('${', '').replace('}', ''));
      const dictionary = await this._options.dictionary.read(keys);
      await this._options.replacer.write(files, variables, dictionary);
      await this._options.exporter.write(dictionary);
    } catch (err) {
      this._options.logger.error(chalk.red(err));
      return 1;
    }

    return 0;
  }

  /**
   * Expands all of the globs to full file paths.
   *
   * This method has logger side effects.
   *
   * @returns A promise that resolves to the array of file paths to fully process and tokenize.
   */
  private async _expandGlobs(): Promise<string[]> {
    if (!this._options.files.length) {
      this._options.logger.warn(ZTokenizer.WarningNoGlobsProvided);
      return [];
    }

    this._options.logger.info(chalk.blue(`Expanding ${this._options.files.length} globs.`));
    const expanded = this._options.files.map((glob) => sync(glob, { dot: true })).reduce((p, c) => p.concat(c), []);

    if (expanded.length) {
      this._options.logger.info(chalk.blue(`Running token replacements on ${expanded.length} files.`));
    } else {
      this._options.logger.warn(ZTokenizer.WarningNoFilesFound);
    }

    return expanded;
  }

  /**
   * Searches for all variables in each file.
   *
   * This method has logger side effects.
   *
   * @param files The files to search.
   *
   * @returns A promise that resolves to the list of unique variables to replace.
   */
  private async _findVariables(files: string[]): Promise<string[]> {
    this._options.logger.info(chalk.blue(`Finding variables in ${files.length} files.`));

    let variables: string[] = [];

    for (const file of files) {
      const buffer = await this._readFileAsync(file);
      const content = buffer.toString('utf-8');
      const matches = content.match(/\${[A-Z_0-9\-.]+}/gim);
      const local = chain(matches).uniq().value();
      variables = variables.concat(local);
    }

    const unique = chain(variables).uniq().value();

    if (unique.length) {
      this._options.logger.info(chalk.blue(`Found a total of ${variables.length} variables across all files, of which, there are ${unique.length} unique variables.`));
    } else {
      this._options.logger.warn(ZTokenizer.WarningNoVariablesFound);
    }

    return unique;
  }
}
