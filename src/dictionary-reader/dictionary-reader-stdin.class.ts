import chalk from 'chalk';
import { prompt, RawListQuestion } from 'inquirer';
import { IZValueReaderFactory } from '../value-reader/value-reader-factory.interface';
import { ZValueStrategy } from '../value-reader/value-strategy.enum';
import { IZDictionaryReader, ZVariableDictionary } from './dictionary-reader.interface';

/**
 * Reads the dictionary from stdin.
 */
export class ZDictionaryReaderStdIn implements IZDictionaryReader {
  /**
   * Initializes a new instance of this object.
   *
   * @param _logger The logger for errors and messages.
   * @param _factory The factory for creating IValueReader strategies.
   */
  public constructor(private readonly _logger: Console, private readonly _factory: IZValueReaderFactory) {}

  /**
   * Gets a value for a key.
   *
   * @param key The key to get the value for.
   *
   * @returns The raw text value of the key.
   */
  public async valueFor(key: string): Promise<string | number | boolean> {
    const question: RawListQuestion = {
      type: 'rawlist',
      name: 'strategy',
      message: chalk.green(`What do you want to do with \${${key}}?`),
      choices: Object.keys(ZValueStrategy).map((key) => ZValueStrategy[key]),
      default: 0,
      pageSize: Infinity
    };

    const answer = await prompt([question]);

    try {
      const strategy = this._factory.create(answer.strategy);
      return await strategy.read(key);
    } catch (err) {
      this._logger.error(chalk.red(err));
      return await this._factory.default().read(key);
    }
  }

  /**
   * Reads all key values from stdin.
   *
   * @param keys The keys to read.
   *
   * @return The dictionary to map key values.
   */
  public async read(keys: string[]): Promise<ZVariableDictionary> {
    const dict: ZVariableDictionary = {};

    for (const key of keys) {
      const value = await this.valueFor(key);
      dict[key] = value;
    }

    return dict;
  }
}
