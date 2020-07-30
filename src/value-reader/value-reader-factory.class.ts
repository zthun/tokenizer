import { identity } from 'lodash';
import { str2base64 } from '../util/str2base64.function';
import { ZValueReaderKeep } from './value-reader-keep.class';
import { ZValueReaderStatic } from './value-reader-static.class';
import { ZValueReaderStdin } from './value-reader-stdin.class';
import { IZValueReader } from './value-reader.interface';
import { ZValueStrategy } from './value-strategy.enum';

export class ZValueReaderFactory {
  public create(strategy: ZValueStrategy): IZValueReader {
    switch (strategy) {
      case ZValueStrategy.String:
        return new ZValueReaderStdin('string', null, identity);
      case ZValueStrategy.Base64:
        return new ZValueReaderStdin('string', null, str2base64);
      case ZValueStrategy.Number:
        return new ZValueReaderStdin('number', 0, identity);
      case ZValueStrategy.Empty:
        return new ZValueReaderStatic('');
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
