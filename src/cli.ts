#!/usr/bin/env node

import chalk from 'chalk';
import { cosmiconfig } from 'cosmiconfig';
import { get } from 'lodash';
import { resolve } from 'path';
import { usage } from 'yargs';
import { IZTokenizerArgs } from './tokenizer/tokenizer-args.interface';
import { ZTokenizerOptions } from './tokenizer/tokenizer-options.class';
import { ZTokenizer } from './tokenizer/tokenizer.class';

const args: IZTokenizerArgs = usage('$0 <globs> [options]')
  .string('dictionary')
  .alias('d', 'dictionary')
  .describe('d', 'JSON dictionary file path.')
  .string('output')
  .alias('o', 'output')
  .describe('o', 'Output directory for tokenized files.')
  .string('export')
  .alias('e', 'export')
  .describe('e', 'The file path to export the dictionary used.')
  .boolean('obey')
  .describe('obey', 'No input will be asked.')
  .boolean('silent')
  .describe('silent', 'No output will be written.')
  .string('cwd')
  .describe('cwd', 'Current working directory.')
  .string('config')
  .describe('config', 'Path to config file to load.')
  .help()
  .parse() as any;

// Yargs default (non-hyphen) comes in as _
if (get(args, '_.length')) {
  args.files = args['_'];
}

const explorer = cosmiconfig('tokenizer');
const search = args.config ? Promise.resolve({ filepath: resolve('.', args.config) }) : explorer.search();

search
  .then((config) => {
    const filepath = get(config, 'filepath');
    console.log(filepath ? chalk.blue(`Loading config file, ${filepath}`) : chalk.yellow('No config file provided.  Using an empty config.'));
    return filepath ? explorer.load(filepath) : Promise.resolve({ filepath, config: {}, isEmpty: true });
  })
  .then((cfg) => {
    const config = get(cfg, 'config') || {};
    const combined: IZTokenizerArgs = Object.assign({}, config, args);
    const options = new ZTokenizerOptions(combined);
    return new ZTokenizer(options).run();
  })
  .then((result) => {
    process.exit(result);
  })
  .catch((err) => {
    console.log(chalk.red(err));
    process.exit(1);
  });
