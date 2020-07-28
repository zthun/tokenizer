import { ZValueReaderFactory } from './value-reader-factory.class';
import { ZValueStrategy } from './value-strategy.enum';
import { ZValueReaderEmpty } from './value-reader-empty.class';
import { ZValueReaderFile } from './value-reader-file.class';
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

  it('should return an empty reader for the empty strategy.', () => {
    assertReaderForStrategy(ZValueReaderEmpty, ZValueStrategy.MakeItEmpty);
  });

  it('should return an file reader for the file strategy.', () => {
    assertReaderForStrategy(ZValueReaderFile, ZValueStrategy.ReadFromFile);
  });

  it('should return a stdin reader for the manual strategy.', () => {
    assertReaderForStrategy(ZValueReaderStdin, ZValueStrategy.EnterValueManually);
  });

  it('should return a keep reader for the keep strategy.', () => {
    assertReaderForStrategy(ZValueReaderKeep, ZValueStrategy.LeaveAsIs);
  });
});
