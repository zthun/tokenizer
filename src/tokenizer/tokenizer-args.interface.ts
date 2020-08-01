export interface IZTokenizerArgs {
  files: string[];
  dictionary?: string;
  export?: string;
  output?: string;
  cwd?: string;
  obey?: boolean;
  config?: string;
  silent?: boolean;
  help?: boolean;
}
