import { ZDictionaryReaderKeep } from './dictionary-reader-keep.class';

describe('ZDictionaryReaderKeep', () => {
  function createTestTarget() {
    return new ZDictionaryReaderKeep();
  }

  it('should return all keys as variable value equivalents.', async () => {
    // Arrange
    const target = createTestTarget();
    const name = '${name}';
    const today = '${today}';
    const version = '${version}';
    const expected = { name, today, version };
    // Act
    const actual = await target.read(['name', 'today', 'version']);
    // Assert
    expect(actual).toEqual(expected);
  });
});
