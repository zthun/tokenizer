import { identity } from 'lodash';
import { IZDictionaryExporter } from './dictionary-exporter.interface';

/**
 * Represents an exporter that doesn't do anything.
 */
export class ZDictionaryExporterSilent implements IZDictionaryExporter {
  /**
   * Returns a resolved promise.
   *
   * @returns A resolved promise.
   */
  public write: () => Promise<void> = identity.bind(this, Promise.resolve());
}
