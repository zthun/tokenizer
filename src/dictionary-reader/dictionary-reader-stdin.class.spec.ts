import { prompt } from 'inquirer';
import { noop } from 'lodash';
import { ZValueReaderFactory } from '../value-reader/value-reader-factory.class';
import { IZValueReaderFactory } from '../value-reader/value-reader-factory.interface';
import { ZValueReaderKeep } from '../value-reader/value-reader-keep.class';
import { ZValueReaderStatic } from '../value-reader/value-reader-static.class';
import { IZValueReader } from '../value-reader/value-reader.interface';
import { ZValueStrategy } from '../value-reader/value-strategy.enum';
import { ZDictionaryReaderStdin } from './dictionary-reader-stdin.class';

jest.mock('inquirer');

describe('ZDictionaryReaderStdin', () => {
  let reader: IZValueReader;
  let def: IZValueReader;
  let factory: IZValueReaderFactory;

  function createTestTarget() {
    return new ZDictionaryReaderStdin(console, factory);
  }

  beforeEach(() => {
    def = new ZValueReaderStatic('d');
    reader = new ZValueReaderKeep();
    factory = new ZValueReaderFactory();

    jest
      .spyOn(reader, 'read')
      .mockClear()
      .mockImplementation((key) => Promise.resolve(key));

    jest.spyOn(def, 'read');

    jest.spyOn(factory, 'create').mockClear().mockReturnValue(reader);
    jest.spyOn(factory, 'default').mockClear().mockReturnValue(def);

    jest.spyOn(console, 'log').mockClear().mockImplementation(noop);
    jest.spyOn(console, 'error').mockClear().mockImplementation(noop);

    ((prompt as unknown) as jest.SpyInstance).mockResolvedValue({ strategy: ZValueStrategy.Leave });
  });

  it('should prompt the user for the options for each variable.', async () => {
    // Arrange
    const target = createTestTarget();
    // Act
    await target.read(['a', 'b', 'c']);
    // Assert
    expect(prompt).toHaveBeenCalledTimes(3);
  });

  it('should return a dictionary with all the values to the given keys.', async () => {
    // Arrange
    const target = createTestTarget();
    // Act
    const actual = await target.read(['a', 'b', 'c']);
    // Assert
    expect(`${actual.a}${actual.b}${actual.c}`).toEqual('abc');
  });

  it('should return the default reader value if there is an error reading the value at any point.', async () => {
    // Arrange
    const target = createTestTarget();
    ((reader.read as unknown) as jest.SpyInstance).mockRejectedValue('failed');
    // Act
    const actual = await target.read(['a', 'b', 'c']);
    // Assert
    expect(`${actual.a}${actual.b}${actual.c}`).toEqual('ddd');
  });

  it('should notify the user that the value failed to read.', async () => {
    // Arrange
    const target = createTestTarget();
    ((reader.read as unknown) as jest.SpyInstance).mockRejectedValue('failed');
    // Act
    await target.read(['a']);
    // Assert
    expect(console.error).toHaveBeenCalledTimes(1);
  });
});
