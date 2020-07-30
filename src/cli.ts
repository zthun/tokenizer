#!/usr/bin/env node

import { usage } from 'yargs';
import { IZTokenizerArgs } from './tokenizer/tokenizer-args.interface';
import { ZTokenizer } from './tokenizer/tokenizer.class';
import { ZTokenizerOptions } from './tokenizer/tokenizer-options.class';

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
  .help()
  .parse() as any;

// Yargs default (non-hyphen) comes in as _
args.files = args['_'];

new ZTokenizer(new ZTokenizerOptions(args)).run().then((result) => process.exit(result));
