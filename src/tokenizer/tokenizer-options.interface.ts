import { IZDictionaryReader } from '../dictionary-reader/dictionary-reader.interface';
import { IZTokenReplacer } from '../token-replacer/token-replacer.interface';

export interface IZTokenizerOptions {
  files: string[];
  dictionary: IZDictionaryReader;
  logger: Console;
  replacer: IZTokenReplacer;
  cwd: string;
}
