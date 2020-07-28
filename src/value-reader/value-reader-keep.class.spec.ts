import { ZValueReaderKeep } from './value-reader-keep.class';

describe('ZValueReaderKeep', () => {
  function createTestTarget() {
    return new ZValueReaderKeep();
  }

  it('resolves the variable format.', async () => {
    // Arrange
    const key = 'key';
    const expected = '${key}';
    const target = createTestTarget();
    // Act
    const actual = await target.read(key);
    // Assert
    expect(actual).toEqual(expected);
  });
});
