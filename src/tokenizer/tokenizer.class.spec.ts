import { mkdir, NoParamCallback, readFile, writeFile } from 'fs';
import { sync } from 'glob';
import { noop } from 'lodash';
import { ZVariableDictionary } from '../dictionary-reader/dictionary-reader.interface';
import { ZTokenizerOptions } from './tokenizer-options.class';
import { IZTokenizerOptions } from './tokenizer-options.interface';
import { ZTokenizer } from './tokenizer.class';

jest.mock('glob');
jest.mock('fs');

describe('ZTokenizer', () => {
  let options: IZTokenizerOptions;
  let fileA: string;
  let fileB: string;
  let contentA: string;
  let contentB: string;
  let dictionary: ZVariableDictionary;
  let read: jest.SpyInstance<Promise<ZVariableDictionary>>;

  function createTestTarget() {
    return new ZTokenizer(options);
  }

  beforeEach(() => {
    fileA = './path/to/globs/file-a.json';
    fileB = './path/to/globs/file-b.json';

    contentA = 'This is the ${content} of the first file and it includes ${x} variables.';
    contentB = 'This is the ${content} of the ${second} file and it includes ${y} variables.';

    const args = { files: ['path/to/globs/**/*.*'], quiet: true };
    options = new ZTokenizerOptions(args);

    jest.spyOn(options.logger, 'error').mockClear().mockImplementation(noop);
    jest.spyOn(options.logger, 'warn').mockClear().mockImplementation(noop);
    jest.spyOn(options.logger, 'info').mockClear().mockImplementation(noop);

    ((sync as unknown) as jest.SpyInstance<string[]>).mockClear().mockReturnValue([fileA, fileB]);

    ((readFile as unknown) as jest.SpyInstance).mockClear().mockImplementation((f: string, c: (err: NodeJS.ErrnoException | null, data: Buffer) => void) => {
      if (f.endsWith('file-a.json')) {
        c(null, Buffer.from(contentA));
      } else if (f.endsWith('file-b.json')) {
        c(null, Buffer.from(contentB));
      } else {
        c(new Error('File not found'), null);
      }
    });

    ((writeFile as unknown) as jest.SpyInstance).mockClear().mockImplementation((f: string, d: any, c: NoParamCallback) => c(null));
    ((mkdir as unknown) as jest.SpyInstance).mockClear().mockImplementation((f: string, d: any, c: NoParamCallback) => c(null));

    dictionary = { content: 'buffered data', x: 2, y: 3 };

    read = jest.spyOn(options.dictionary, 'read');
    read.mockResolvedValue(dictionary);
  });

  async function assertAppReturnsCode(expected: number) {
    // Arrange
    const target = createTestTarget();
    // Act
    const actual = await target.run();
    // Assert
    expect(actual).toEqual(expected);
  }

  describe('Success', () => {
    it('should return 0 if the application runs successfully.', async () => {
      await assertAppReturnsCode(0);
    });
  });

  describe('Error', () => {
    it('should return 1 if an error occurs when writing files.', async () => {
      // Arrange
      ((writeFile as unknown) as jest.SpyInstance).mockImplementation((f: string, d: any, c: NoParamCallback) => c(new Error('Could not write file.')));
      await assertAppReturnsCode(1);
    });

    it('should return 1 if an error occurs when reading files.', async () => {
      // Arrange
      read.mockRejectedValue(new Error('Failed to read files'));
      await assertAppReturnsCode(1);
    });
  });

  describe('Warnings', () => {
    async function assertUserWarned(msg: any) {
      // Arrange
      const target = createTestTarget();
      // Act
      await target.run();
      // Assert
      expect(options.logger.warn).toHaveBeenCalledWith(msg);
    }

    describe('No globs provided.', () => {
      beforeEach(() => {
        options.files = [];
      });

      it('should warn the user.', async () => {
        await assertUserWarned(ZTokenizer.WarningNoGlobsProvided);
      });

      it('should return 0.', async () => {
        await assertAppReturnsCode(0);
      });
    });

    describe('No files found from globs.', () => {
      beforeEach(() => {
        ((sync as unknown) as jest.SpyInstance).mockReturnValue([]);
      });

      it('should warn the user.', async () => {
        await assertUserWarned(ZTokenizer.WarningNoFilesFound);
      });

      it('should return 0.', async () => {
        await assertAppReturnsCode(0);
      });
    });

    describe('No variables found in files.', () => {
      beforeEach(() => {
        contentA = 'This is file-a content with no variables.';
        contentB = 'This is file-b content with no variables.';
      });

      it('should warn the user.', async () => {
        await assertUserWarned(ZTokenizer.WarningNoVariablesFound);
      });

      it('should return 0.', async () => {
        await assertAppReturnsCode(0);
      });
    });
  });
});
