import chalk from 'chalk';
import { readFile, writeFile, mkdir } from 'fs';
import { sync } from 'glob';
import { chain } from 'lodash';
import { join, dirname } from 'path';
import { promisify } from 'util';
import { ZVariableDictionary } from '../dictionary-reader/dictionary-reader.interface';
import { IZTokenizerOptions } from './tokenizer-options.interface';

/**
 * Represents the root application.
 */
export class ZTokenizer {
  public static readonly WarningNoGlobsProvided = chalk.yellow('No globs were provided.  Check your files option in your tokenizer config file or pass the globs on the command line.');
  public static readonly WarningNoFilesFound = chalk.yellow('No files found to process');
  public static readonly WarningNoVariablesFound = chalk.yellow('No variables were found in any of the discovered files.  A one to one copy of every file will be made with no changes.');

  private _readFileAsync = promisify(readFile);
  private _writeFileAsync = promisify(writeFile);
  private _mkdirAsync = promisify(mkdir);

  /**
   * Initializes a new instance of this object.
   *
   * @param options The application options.
   */
  public constructor(private readonly _options: IZTokenizerOptions) {}

  /**
   * Runs the application.
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
      await this._writeFiles(variables, keys, dictionary, files);
    } catch (err) {
      this._options.logger.error(chalk.red(err));
      return 1;
    }

    return 0;
  }

  private async _expandGlobs(): Promise<string[]> {
    if (!this._options.files.length) {
      this._options.logger.warn(ZTokenizer.WarningNoGlobsProvided);
      return [];
    }

    this._options.logger.info(chalk.cyan(`Expanding ${this._options.files.length} globs.`));
    const expanded = this._options.files.map((glob) => sync(glob, { dot: true })).reduce((p, c) => p.concat(c), []);

    if (expanded.length) {
      this._options.logger.info(chalk.green(`Running token replacements on ${expanded.length} files.`));
    } else {
      this._options.logger.warn(ZTokenizer.WarningNoFilesFound);
    }

    return expanded;
  }

  private async _findVariables(files: string[]): Promise<string[]> {
    this._options.logger.info(`Finding variables in ${files.length} files.`);

    let variables: string[] = [];

    for (const file of files) {
      const content = await this._readFileContent(file);
      const matches = content.match(/\${[A-Z_0-9\-.]+}/gim);
      const local = chain(matches).uniq().value();
      variables = variables.concat(local);
    }

    const unique = chain(variables).uniq().value();

    if (unique.length) {
      this._options.logger.info(chalk.green(`Found a total of ${variables.length} variables across all files, of which, there are ${unique.length} unique variables.`));
    } else {
      this._options.logger.warn(ZTokenizer.WarningNoVariablesFound);
    }

    return unique;
  }

  private async _writeFiles(variables: string[], keys: string[], dictionary: ZVariableDictionary, files: string[]) {
    this._options.logger.info(chalk.cyan(`Writing out ${files.length} files to ${this._options.outputDirectory}`));

    for (const file of files) {
      const outputPath = join(this._options.outputDirectory, file.replace(this._options.cwd, ''));
      const parent = dirname(outputPath);
      const content = await this._readFileContent(file);
      let replaced = content;
      variables.forEach((variable, i) => (replaced = replaced.split(variable).join((dictionary[keys[i]] ?? variable).toString())));
      await this._mkdirAsync(parent, { recursive: true });
      await this._writeFileAsync(outputPath, replaced);
    }
  }

  private async _readFileContent(file: string): Promise<string> {
    const buffer = await this._readFileAsync(file);
    return buffer.toString('utf-8');
  }
}
