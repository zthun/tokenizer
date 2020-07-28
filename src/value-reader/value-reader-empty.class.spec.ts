import { ZValueReaderEmpty } from './value-reader-empty.class';

describe('ZValueReaderEmpty', () => {
  function createTestTarget() {
    return new ZValueReaderEmpty();
  }

  it('resolves the empty string.', async () => {
    // Arrange
    const target = createTestTarget();
    // Act
    const actual = await target.read();
    // Assert
    expect(actual).toEqual('');
  });
});
