#!/usr/bin/env node

import { usage } from 'yargs';
import { IZTokenizerArgs } from './tokenizer/tokenizer-args.interface';
import { ZTokenizer } from './tokenizer/tokenizer.class';
import { ZTokenizerOptions } from './tokenizer/tokenizer-options.class';

const args: IZTokenizerArgs = usage('$0 <globs> [options]')
  .alias('d', 'dictionaryFile')
  .describe('d', 'Optional json dictionary file path.')
  .alias('o', 'outputDirectory')
  .describe('o', 'Output directory.')
  .boolean('quiet')
  .describe('quiet', 'No input will be asked.')
  .string('cwd')
  .describe('cwd', 'Current working directory.')
  .help()
  .parse() as any;

// Yargs default (non-hyphen) comes in as _
args.files = args['_'];

new ZTokenizer(new ZTokenizerOptions(args)).run().then((result) => process.exit(result));
