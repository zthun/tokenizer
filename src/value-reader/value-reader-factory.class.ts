import { ZValueReaderEmpty } from './value-reader-empty.class';
import { ZValueReaderFile } from './value-reader-file.class';
import { ZValueReaderKeep } from './value-reader-keep.class';
import { ZValueReaderStdin } from './value-reader-stdin.class';
import { IZValueReader } from './value-reader.interface';
import { ZValueStrategy } from './value-strategy.enum';

export class ZValueReaderFactory {
  public create(strategy: ZValueStrategy): IZValueReader {
    switch (strategy) {
      case ZValueStrategy.EnterValueManually:
        return new ZValueReaderStdin();
      case ZValueStrategy.ReadFromFile:
        return new ZValueReaderFile();
      case ZValueStrategy.MakeItEmpty:
        return new ZValueReaderEmpty();
      default:
        return this.default();
    }
  }

  public default(): IZValueReader {
    return new ZValueReaderKeep();
  }
}
