import { IZValueReader } from './value-reader.interface';

export class ZValueReaderEmpty implements IZValueReader {
  public async read(): Promise<string> {
    return '';
  }
}
