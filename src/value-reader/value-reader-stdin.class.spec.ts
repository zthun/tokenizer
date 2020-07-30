import { ZValueReaderStdin } from './value-reader-stdin.class';
import { identity } from 'lodash';
import { prompt } from 'inquirer';

jest.mock('inquirer');

describe('ZValueReaderStdin', () => {
  let value: number;

  function createTestTarget() {
    return new ZValueReaderStdin('number', 0, identity);
  }

  beforeEach(() => {
    value = 100;

    ((prompt as unknown) as jest.SpyInstance).mockResolvedValue({ value });
  });

  it('should return a value from a stdin prompt.', async () => {
    // Arrange
    const target = createTestTarget();
    // Act
    const actual = await target.read();
    // Assert
    expect(actual).toEqual(value);
  });
});
