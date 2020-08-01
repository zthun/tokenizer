import { ZDictionaryReaderFile } from './dictionary-reader-file.class';
import { IZDictionaryReader, ZVariableDictionary } from './dictionary-reader.interface';
import { readFile } from 'fs';
import { noop } from 'lodash';

jest.mock('fs');

describe('ZDictionaryReaderFile', () => {
  let file: string;
  let fallback: jest.Mocked<IZDictionaryReader>;
  let dict: ZVariableDictionary;
  let buffer: Buffer;
  let remaining: ZVariableDictionary;

  function createTestTarget() {
    return new ZDictionaryReaderFile(file, console, fallback);
  }

  beforeEach(() => {
    file = 'path/to/dictionary/file';

    dict = {
      today: new Date().toJSON(),
      version: '1.0.9'
    };

    remaining = {
      name: 'batman'
    };

    fallback = {
      read: jest.fn().mockResolvedValue(Promise.resolve(remaining))
    };

    buffer = Buffer.from(JSON.stringify(dict));
    ((readFile as unknown) as jest.Mock).mockImplementation((p, c) => c(null, buffer));

    jest.spyOn(console, 'warn').mockClear().mockImplementation(noop);
  });

  it('should return the dictionary from the file if everything is available.', async () => {
    // Arrange
    const target = createTestTarget();
    // Act
    const actual = await target.read(['today', 'version']);
    // Assert
    expect(actual).toEqual(dict);
  });

  it('should add in the remaining keys if keys are missing.', async () => {
    // Arrange
    const target = createTestTarget();
    const expected = Object.assign({}, dict, remaining);
    // Act
    const actual = await target.read(['today', 'name']);
    // Assert
    expect(actual).toEqual(expected);
  });

  it('should warn the user that the file could not be read.', async () => {
    // Arrange
    const target = createTestTarget();
    ((readFile as unknown) as jest.Mock).mockClear().mockImplementation((p, c) => c('failed', null));
    // Act
    await target.read(['today', 'name']);
    // Assert
    expect(console.warn).toHaveBeenCalledWith(expect.stringContaining(ZDictionaryReaderFile.WarningUnableToReadFile));
  });

  it('should add in all remaining keys if the file cannot be read.', async () => {
    // Arrange
    const target = createTestTarget();
    const keys = Object.keys(dict).concat(Object.keys(remaining));
    const expected = Object.assign({}, dict, remaining);
    ((readFile as unknown) as jest.Mock).mockClear().mockImplementation((p, c) => c('failed', null));
    (fallback.read as jest.SpyInstance).mockClear().mockResolvedValue(expected);
    // Act
    const actual = await target.read(keys);
    // Assert
    expect(actual).toEqual(expected);
  });
});
