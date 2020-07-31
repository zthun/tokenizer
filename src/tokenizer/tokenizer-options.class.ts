import { resolve } from 'path';
import { ZDictionaryExporterJson } from '../dictionary-exporter/dictionary-exporter-json.class';
import { ZDictionaryExporterSilent } from '../dictionary-exporter/dictionary-exporter-silent.class';
import { IZDictionaryExporter } from '../dictionary-exporter/dictionary-exporter.interface';
import { ZDictionaryReaderFile } from '../dictionary-reader/dictionary-reader-file.class';
import { ZDictionaryReaderKeep } from '../dictionary-reader/dictionary-reader-keep.class';
import { ZDictionaryReaderStdin } from '../dictionary-reader/dictionary-reader-stdin.class';
import { IZDictionaryReader } from '../dictionary-reader/dictionary-reader.interface';
import { ZTokenReplacerFiles } from '../token-replacer/token-replacer-files.class';
import { ZTokenReplacerSilent } from '../token-replacer/token-replacer-silent.class';
import { IZTokenReplacer } from '../token-replacer/token-replacer.interface';
import { ZValueReaderFactory } from '../value-reader/value-reader-factory.class';
import { IZTokenizerArgs } from './tokenizer-args.interface';
import { IZTokenizerOptions } from './tokenizer-options.interface';

/**
 * Represents an object that will construct options for the ZTokenizer application based on the args configuration.
 */
export class ZTokenizerOptions implements IZTokenizerOptions {
  public static readonly DefaultOutputDirectory = '__tokenizer';
  public files: string[];
  public dictionary: IZDictionaryReader;
  public replacer: IZTokenReplacer;
  public exporter: IZDictionaryExporter;
  public logger: Console;
  public cwd: string;

  /**
   * Initializes a new instance of this object.
   *
   * @param args The arguments to construct this options class.
   */
  public constructor(args: IZTokenizerArgs) {
    this.logger = console;
    this.cwd = args.cwd ? resolve(args.cwd) : resolve('.');
    this.files = (args.files || []).map((file) => resolve(this.cwd, file));

    this.replacer = new ZTokenReplacerSilent();

    if (!args.silent) {
      const output = args.output ? resolve(this.cwd, args.output) : resolve(this.cwd, ZTokenizerOptions.DefaultOutputDirectory);
      this.replacer = new ZTokenReplacerFiles(output, this.cwd);
    }

    this.exporter = new ZDictionaryExporterSilent();

    if (args.export) {
      const path = resolve(this.cwd, args.export);
      this.exporter = new ZDictionaryExporterJson(path);
    }

    const factory = new ZValueReaderFactory();
    const stdin = new ZDictionaryReaderStdin(this.logger, factory);
    const keep = new ZDictionaryReaderKeep();

    this.dictionary = stdin;

    if (!args.dictionary && args.obey) {
      this.dictionary = keep;
    } else if (args.dictionary) {
      const file = resolve(this.cwd, args.dictionary);
      const fallback = args.obey ? keep : stdin;
      this.dictionary = new ZDictionaryReaderFile(file, fallback);
    }
  }
}
