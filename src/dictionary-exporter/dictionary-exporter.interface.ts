import { ZVariableDictionary } from '../dictionary-reader/dictionary-reader.interface';

export interface IZDictionaryExporter {
  write(dictionary: ZVariableDictionary): Promise<void>;
}
