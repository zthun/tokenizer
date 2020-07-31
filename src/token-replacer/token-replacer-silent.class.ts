import { IZTokenReplacer } from './token-replacer.interface';
import { identity } from 'lodash';

/**
 * Represents a token replacer that does....nothing.
 */
export class ZTokenReplacerSilent implements IZTokenReplacer {
  /**
   * Doesn't do anything.
   *
   * @returns A resolved promise.
   */
  public write: () => Promise<void> = identity.bind(this, Promise.resolve());
}
