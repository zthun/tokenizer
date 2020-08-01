import { ZTokenReplacerFiles } from './token-replacer-files.class';
import { readFile, writeFile, mkdir, NoParamCallback } from 'fs';
import { ZVariableDictionary } from '../dictionary-reader/dictionary-reader.interface';
import { resolve } from 'path';
import { noop } from 'lodash';

jest.mock('fs');

describe('ZTokenReplacerFiles', () => {
  let output: string;
  let cwd: string;
  let fileA: string;
  let fileB: string;
  let contentA: string;
  let contentB: string;
  let dictionary: ZVariableDictionary;
  let variables: string[];

  function createTestTarget(output: string) {
    return new ZTokenReplacerFiles(output, cwd, console);
  }

  beforeEach(() => {
    output = '/tmp/__tokenizer';
    cwd = resolve('.');

    dictionary = { content: 'buffered data', x: 2, y: 3 };
    variables = ['${content}', '${x}', '${y}', '${second}'];

    fileA = 'path/to/globs/file-a.json';
    fileB = 'path/to/globs/file-b.json';

    contentA = 'This is the ${content} of the first file and it includes ${x} variables.';
    contentB = 'This is the ${content} of the ${second} file and it includes ${y} variables.';

    ((readFile as unknown) as jest.SpyInstance).mockClear().mockImplementation((f: string, c: (err: NodeJS.ErrnoException | null, data: Buffer) => void) => {
      if (f.endsWith('file-a.json')) {
        c(null, Buffer.from(contentA));
      } else if (f.endsWith('file-b.json')) {
        c(null, Buffer.from(contentB));
      } else {
        c(new Error('File not found'), null);
      }
    });

    jest.spyOn(console, 'log').mockClear().mockImplementation(noop);

    ((writeFile as unknown) as jest.SpyInstance).mockClear().mockImplementation((f: string, d: any, c: NoParamCallback) => c(null));
    ((mkdir as unknown) as jest.SpyInstance).mockClear().mockImplementation((f: string, d: any, c: NoParamCallback) => c(null));
  });

  it('should output files relative to the output and cwd paths.', async () => {
    // Arrange
    const target = createTestTarget(output);
    const expected = resolve(output, fileA);
    // Act
    await target.write([fileA], variables, dictionary);
    // Assert
    expect(writeFile).toHaveBeenCalledWith(expected, expect.anything(), expect.anything());
  });

  it('should output the files to the logger if the output is falsy.', async () => {
    // Arrange
    const target = createTestTarget(null);
    const expected = contentA.replace('${content}', `${dictionary.content}`).replace('${x}', `${dictionary.x}`);
    // Act
    await target.write([fileA], variables, dictionary);
    // Assert
    expect(console.log).toHaveBeenCalledWith(expected);
  });

  it('should replace variables in a file.', async () => {
    // Arrange
    const target = createTestTarget(output);
    const expected = contentA.replace('${content}', `${dictionary.content}`).replace('${x}', `${dictionary.x}`);
    // Act
    await target.write([fileA], variables, dictionary);
    // Assert
    expect(writeFile).toHaveBeenCalledWith(expect.anything(), expected, expect.anything());
  });

  it('leaves variables alone if they are not found in the dictionary.', async () => {
    // Arrange
    const target = createTestTarget(output);
    const expected = contentB.replace('${content}', `${dictionary.content}`).replace('${y}', `${dictionary.y}`);
    // Act
    await target.write([fileB], variables, dictionary);
    // Assert
    expect(writeFile).toHaveBeenCalledWith(expect.anything(), expected, expect.anything());
  });
});
