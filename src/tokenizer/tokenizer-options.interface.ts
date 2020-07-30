import { IZDictionaryReader } from '../dictionary-reader/dictionary-reader.interface';

export interface IZTokenizerOptions {
  files: string[];
  dictionary: IZDictionaryReader;
  logger: Console;
  export: string;
  outputDirectory: string;
  cwd: string;
}
