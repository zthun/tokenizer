import { ZValueReaderStatic } from './value-reader-static.class';

describe('ZValueReaderEmpty', () => {
  let value: any;

  function createTestTarget() {
    return new ZValueReaderStatic(value);
  }

  beforeEach(() => {
    value = 'should always return this.';
  });

  it('resolves the provided value.', async () => {
    // Arrange
    const target = createTestTarget();
    // Act
    const actual = await target.read();
    // Assert
    expect(actual).toEqual(value);
  });
});
