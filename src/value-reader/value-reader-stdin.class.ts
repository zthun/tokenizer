import { IZValueReader } from './value-reader.interface';

export class ZValueReaderStdin implements IZValueReader {
  public read(): Promise<string> {
    return Promise.reject('Not supported yet.');
  }
}
