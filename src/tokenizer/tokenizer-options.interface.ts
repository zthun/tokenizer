import { IZDictionaryReader } from '../dictionary-reader/dictionary-reader.interface';

export interface IZTokenizerOptions {
  files: string[];
  dictionary: IZDictionaryReader;
  logger: Console;
  export: string;
  output: string;
  cwd: string;
  dry: boolean;
}
