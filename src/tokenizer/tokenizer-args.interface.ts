export interface IZTokenizerArgs {
  files: string[];
  dictionaryFile?: string;
  outputDictionary?: string;
  outputDirectory?: string;
  cwd?: string;
  quiet?: boolean;
}
