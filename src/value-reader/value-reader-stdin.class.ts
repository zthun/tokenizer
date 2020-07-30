import { IZValueReader } from './value-reader.interface';
import { prompt, Question, RawListQuestion } from 'inquirer';
import chalk from 'chalk';

export class ZValueReaderStdin implements IZValueReader {
  public async read(): Promise<string | number> {
    const typeMap = {
      String: 'string',
      Number: 'number',
      Password: 'password',
      Boolean: 'confirm'
    };

    const defaultMap = {
      String: '',
      Number: 0,
      Password: '',
      Boolean: false
    };

    const typeQ: RawListQuestion = {
      type: 'rawlist',
      name: 'syntax',
      message: chalk.gray('Type?'),
      choices: ['String', 'Number', 'Password', 'Boolean'],
      default: 0
    };

    const { syntax } = await prompt([typeQ]);
    const type = typeMap[syntax];
    const def = defaultMap[syntax];

    const valueQ: Question = {
      type,
      name: 'value',
      message: chalk.gray('Value?'),
      default: def
    };

    const encodingQ: RawListQuestion = {
      type: 'rawlist',
      name: 'encoding',
      message: chalk.gray('Encoding?'),
      choices: ['none', 'base64'],
      default: 0
    };

    const { value, encoding } = await prompt([valueQ, encodingQ]);
    return encoding !== 'none' ? Buffer.from(`${value}`).toString(encoding) : value;
  }
}
