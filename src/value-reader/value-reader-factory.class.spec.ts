import { ZValueReaderFactory } from './value-reader-factory.class';
import { ZValueStrategy } from './value-strategy.enum';
import { ZValueReaderStatic } from './value-reader-static.class';
import { ZValueReaderStdin } from './value-reader-stdin.class';
import { ZValueReaderKeep } from './value-reader-keep.class';

describe('ZValueReaderFactory', () => {
  function createTestTarget() {
    return new ZValueReaderFactory();
  }

  async function assertReaderForStrategy(expected: any, strategy: ZValueStrategy) {
    // Arrange
    const target = createTestTarget();
    // Act
    const actual = target.create(strategy);
    // Assert
    expect(actual).toBeInstanceOf(expected);
  }

  it('should return a keep reader for the keep strategy.', () => {
    assertReaderForStrategy(ZValueReaderKeep, ZValueStrategy.Leave);
  });

  it('should return a static reader for the empty string strategy.', () => {
    assertReaderForStrategy(ZValueReaderStatic, ZValueStrategy.Empty);
  });

  it('should return a static reader for the null strategy.', () => {
    assertReaderForStrategy(ZValueReaderStatic, ZValueStrategy.Null);
  });

  it('should return a static reader for the true strategy.', () => {
    assertReaderForStrategy(ZValueReaderStatic, ZValueStrategy.True);
  });

  it('should return a static reader for the false strategy.', () => {
    assertReaderForStrategy(ZValueReaderStatic, ZValueStrategy.False);
  });

  it('should return a stdin reader for the string strategy.', () => {
    assertReaderForStrategy(ZValueReaderStdin, ZValueStrategy.String);
  });

  it('should return a stdin reader for the base64 strategy.', () => {
    assertReaderForStrategy(ZValueReaderStdin, ZValueStrategy.Base64);
  });

  it('should return a stdin reader for the number strategy.', () => {
    assertReaderForStrategy(ZValueReaderStdin, ZValueStrategy.Number);
  });
});
