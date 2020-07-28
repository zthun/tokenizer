import { IZDictionaryReader } from '../dictionary-reader/dictionary-reader.interface';

export interface IZTokenizerOptions {
  files: string[];
  dictionary: IZDictionaryReader;
  logger: Console;
  outputDictionary: string;
  outputDirectory: string;
  cwd: string;
}
