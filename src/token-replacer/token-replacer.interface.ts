import { ZVariableDictionary } from '../dictionary-reader/dictionary-reader.interface';

export interface IZTokenReplacer {
  /**
   * Replaces all variables to the file list.
   *
   * @param files The files to run the replacement on.
   * @param variables The list of variables to replace.
   * @param dictionary The dictionary that contains the key to value replacements.
   *
   * @returns A promise that, when resolved, replaces all variables in each file and outputs them.
   */
  write(files: string[], variables: string[], dictionary: ZVariableDictionary): Promise<void>;
}
