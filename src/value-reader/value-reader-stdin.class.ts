import chalk from 'chalk';
import { prompt, Question } from 'inquirer';
import { IZValueReader } from './value-reader.interface';

/**
 * Represents a value reader that retrieves a value from stdin and transforms the value.
 */
export class ZValueReaderStdin implements IZValueReader {
  /**
   * Initializes a new instance of this object.
   *
   * @param inquire The inquire type.
   * @param transform The transformation function on the value.
   */
  public constructor(public inquire: 'string' | 'number', public defaults: any, public transform: (val: string | number) => string | number) {}

  /**
   * Reads from stdin.
   *
   * @returns A promise that returns the value entered.
   */
  public async read(): Promise<string | number> {
    const valueQ: Question = {
      type: this.inquire,
      name: 'value',
      message: chalk.gray('Value?'),
      default: this.defaults
    };

    const { value } = await prompt([valueQ]);
    return this.transform(value);
  }
}
