import { IZDictionaryReader } from '../dictionary-reader/dictionary-reader.interface';
import { IZTokenReplacer } from '../token-replacer/token-replacer.interface';
import { IZDictionaryExporter } from '../dictionary-exporter/dictionary-exporter.interface';

export interface IZTokenizerOptions {
  files: string[];
  dictionary: IZDictionaryReader;
  logger: Console;
  replacer: IZTokenReplacer;
  exporter: IZDictionaryExporter;
  cwd: string;
}
