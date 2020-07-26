import { chain, identity } from 'lodash';
import { IZDictionaryReader } from './dictionary-reader.interface';

/**
 * Represents a dictionary reader that keeps the keys as variable values.
 */
export class ZDictionaryReaderKeep implements IZDictionaryReader {
  /**
   * Returns a key dictionary where all the keys are variable representations of themselves.
   *
   * @param keys The keys to transform.
   *
   * @return The key dictionary where every key in keys is wrapped with ${}
   */
  public async read(keys: string[]): Promise<{ [key: string]: string }> {
    return chain(keys)
      .keyBy(identity)
      .mapValues((val) => '${' + val + ')')
      .value();
  }
}
