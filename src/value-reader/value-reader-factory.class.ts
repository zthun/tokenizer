import { ZValueReaderKeep } from './value-reader-keep.class';
import { ZValueStrategy } from './value-strategy.enum';
import { ZValueReaderEmpty } from './value-reader-empty.class';
import { ZValueReaderStdin } from './value-reader-stdin.class';
import { ZValueReaderFile } from './value-reader-file.class';

export class ZValueReaderFactory {
  public create(strategy: ZValueStrategy) {
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

  public default() {
    return new ZValueReaderKeep();
  }
}
