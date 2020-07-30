import { resolve } from 'path';
import { IZDictionaryReader } from '../dictionary-reader/dictionary-reader.interface';
import { IZTokenizerArgs } from './tokenizer-args.interface';
import { IZTokenizerOptions } from './tokenizer-options.interface';
import { ZValueReaderFactory } from '../value-reader/value-reader-factory.class';
import { ZDictionaryReaderStdIn } from '../dictionary-reader/dictionary-reader-stdin.class';
import { ZDictionaryReaderKeep } from '../dictionary-reader/dictionary-reader-keep.class';
import { ZDictionaryReaderFile } from '../dictionary-reader/dictionary-reader-file.class';

/**
 * Represents an object that will construct options for the ZTokenizer application based on the args configuration.
 */
export class ZTokenizerOptions implements IZTokenizerOptions {
  public static readonly DefaultOutputDirectory = '__tokenizer';
  public files: string[];
  public dictionary: IZDictionaryReader;
  public logger: Console;
  public export: string;
  public output: string;
  public cwd: string;
  public dry: boolean;

  /**
   * Initializes a new instance of this object.
   */
  public constructor(args: IZTokenizerArgs) {
    this.logger = console;
    this.cwd = args.cwd ? resolve(args.cwd) : resolve('.');
    this.files = (args.files || []).map((file) => resolve(this.cwd, file));
    this.export = args.export ? resolve(this.cwd, args.export) : null;
    this.output = args.output ? resolve(this.cwd, args.output) : resolve(this.cwd, ZTokenizerOptions.DefaultOutputDirectory);

    const factory = new ZValueReaderFactory();
    const stdin = new ZDictionaryReaderStdIn(this.logger, factory);
    const keep = new ZDictionaryReaderKeep();

    if (!args.dictionary && args.obey) {
      this.dictionary = keep;
    } else if (args.dictionary) {
      const file = resolve(this.cwd, args.dictionary);
      const fallback = args.obey ? keep : stdin;
      this.dictionary = new ZDictionaryReaderFile(file, fallback);
    } else {
      this.dictionary = stdin;
    }
  }
}
