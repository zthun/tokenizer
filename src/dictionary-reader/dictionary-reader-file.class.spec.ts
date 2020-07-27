import { ZDictionaryReaderFile } from './dictionary-reader-file.class';
import { IZDictionaryReader, ZVariableDictionary } from './dictionary-reader.interface';
import { readFile } from 'fs';

jest.mock('fs');

describe('ZDictionaryReaderFile', () => {
  let file: string;
  let fallback: jest.Mocked<IZDictionaryReader>;
  let dict: ZVariableDictionary;
  let buffer: Buffer;
  let remaining: ZVariableDictionary;

  function createTestTarget() {
    return new ZDictionaryReaderFile(file, fallback);
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
});
