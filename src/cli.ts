/* istanbul ignore file */

import { usage } from 'yargs';
import { ZDictionaryReaderStdIn } from './dictionary-reader/dictionary-reader-stdin.class';
import { IZTokenizerArgs } from './tokenizer/tokenizer-args.interface';
import { ZTokenizer } from './tokenizer/tokenizer.class';
import { ZDictionaryReaderKeep } from './dictionary-reader/dictionary-reader-keep.class';
import { ZDictionaryReaderFile } from './dictionary-reader/dictionary-reader-file.class';
import { IZDictionaryReader } from './dictionary-reader/dictionary-reader.interface';

const args: IZTokenizerArgs = usage('$0 [options]')
  .alias('i', 'inputFile')
  .demandOption('i')
  .describe('i', 'Path to the input file to replace tokens for.')
  .alias('d', 'dictionaryFile')
  .describe('d', 'Optional json dictionary file path.')
  .alias('o', 'outputFile')
  .describe('o', 'Optional output file path.')
  .help()
  .parse() as any;

const dictionaryReaderFallback = new ZDictionaryReaderKeep();
let dictionaryReader: IZDictionaryReader = new ZDictionaryReaderStdIn();

if (args.dictionaryFile) {
  dictionaryReader = new ZDictionaryReaderFile(args.dictionaryFile, dictionaryReaderFallback);
}

new ZTokenizer(args.inputFile, args.outputFile, dictionaryReader)
  .run()
  .then((result) => process.exit(result))
  .catch((err) => {
    console.log(err);
    process.exit(1);
  });
