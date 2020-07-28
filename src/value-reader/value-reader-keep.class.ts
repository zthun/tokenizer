import { IZValueReader } from './value-reader.interface';

export class ZValueReaderKeep implements IZValueReader {
  public async read(key: string): Promise<string> {
    return `\${${key}}`;
  }
}
