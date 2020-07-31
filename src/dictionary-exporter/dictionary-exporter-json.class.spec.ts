import { ZVariableDictionary } from '../dictionary-reader/dictionary-reader.interface';
import { ZDictionaryExporterJson } from './dictionary-exporter-json.class';
import { writeFile, mkdir, NoParamCallback } from 'fs';

jest.mock('fs');

describe('ZDictionaryExporterJson', () => {
  let path: string;
  let dictionary: ZVariableDictionary;

  function createTestTarget() {
    return new ZDictionaryExporterJson(path);
  }

  beforeEach(() => {
    path = '/tmp/dictionary.json';

    dictionary = {
      x: 1,
      y: 'hello',
      z: true,
      d: new Date().toJSON()
    };

    ((writeFile as unknown) as jest.SpyInstance).mockClear().mockImplementation((f: any, d: any, c: NoParamCallback) => c(null));
    ((mkdir as unknown) as jest.SpyInstance).mockClear().mockImplementation((p: any, o: any, c: NoParamCallback) => c(null));
  });

  it('should write out the json to the given path.', async () => {
    // Arrange
    const target = createTestTarget();
    const expected = JSON.stringify(dictionary, null, ZDictionaryExporterJson.JSON_SPACING);
    // Act
    await target.write(dictionary);
    // Assert
    expect(writeFile).toHaveBeenCalledWith(path, expected, expect.anything());
  });
});
