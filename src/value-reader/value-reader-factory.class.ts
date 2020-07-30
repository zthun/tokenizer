import { ZValueReaderStatic } from './value-reader-static.class';
import { ZValueReaderKeep } from './value-reader-keep.class';
import { ZValueReaderStdin } from './value-reader-stdin.class';
import { IZValueReader } from './value-reader.interface';
import { ZValueStrategy } from './value-strategy.enum';
import { identity } from 'lodash';

export class ZValueReaderFactory {
  public create(strategy: ZValueStrategy): IZValueReader {
    switch (strategy) {
      case ZValueStrategy.String:
        return new ZValueReaderStdin('string', null, identity);
      case ZValueStrategy.Base64:
        return new ZValueReaderStdin('string', null, btoa);
      case ZValueStrategy.Number:
        return new ZValueReaderStdin('number', 0, identity);
      case ZValueStrategy.Empty:
        return new ZValueReaderStatic('');
      case ZValueStrategy.Null:
        return new ZValueReaderStatic(null);
      case ZValueStrategy.True:
        return new ZValueReaderStatic(true);
      case ZValueStrategy.False:
        return new ZValueReaderStatic(false);
      default:
        return this.default();
    }
  }

  public default(): IZValueReader {
    return new ZValueReaderKeep();
  }
}
