import { IZTokenizerArgs } from './tokenizer-args.interface';
import { ZTokenizerOptions } from './tokenizer-options.class';
import { resolve } from 'path';
import { ZDictionaryReaderKeep } from '../dictionary-reader/dictionary-reader-keep.class';
import { ZDictionaryReaderFile } from '../dictionary-reader/dictionary-reader-file.class';
import { ZDictionaryReaderStdin } from '../dictionary-reader/dictionary-reader-stdin.class';
import { ZTokenReplacerFiles } from '../token-replacer/token-replacer-files.class';
import { ZTokenReplacerSilent } from '../token-replacer/token-replacer-silent.class';

describe('ZTokenizerOptions', () => {
  let args: IZTokenizerArgs;

  beforeEach(() => {
    args = {
      files: ['path/to/files/**/*.*', 'more-paths/for/files/*.json']
    };
  });

  function createTestTarget() {
    return new ZTokenizerOptions(args);
  }

  describe('CWD', () => {
    it('defaults to the directory the process was ran from.', () => {
      // Arrange
      const expected = resolve('.');
      // Act
      const target = createTestTarget();
      // Assert
      expect(target.cwd).toEqual(expected);
    });

    it('resolves the cwd to the full path.', () => {
      // Arrange
      const cwd = 'path/to/folder';
      const expected = resolve('.', cwd);
      args.cwd = cwd;
      // Act
      const target = createTestTarget();
      // Assert
      expect(target.cwd).toEqual(expected);
    });
  });

  describe('Files', () => {
    it('resolves all files.', () => {
      // Arrange
      const expected = args.files.map((file) => resolve('.', file));
      // Act
      const target = createTestTarget();
      // Assert
      expect(target.files).toEqual(expected);
    });

    it('sets an empty array if no files are passed.', () => {
      // Arrange
      delete args.files;
      // Act
      const target = createTestTarget();
      // Assert
      expect(target.files).toEqual([]);
    });
  });

  describe('Replacer', () => {
    it('resolves to a silent replacer if the silent flag is set.', () => {
      // Arrange
      args.silent = true;
      // Act
      const target = createTestTarget();
      // Assert
      expect(target.replacer).toBeInstanceOf(ZTokenReplacerSilent);
    });

    it('resolves to a files replacer if the silent flag is not set.', () => {
      // Arrange
      // Act
      const target = createTestTarget();
      // Assert
      expect(target.replacer).toBeInstanceOf(ZTokenReplacerFiles);
    });

    it('resolves to the output directory to the default if not set relative to the cwd.', () => {
      // Arrange
      const expected = resolve('.', ZTokenizerOptions.DefaultOutputDirectory);
      // Act
      const target = createTestTarget();
      const actual = (target.replacer as ZTokenReplacerFiles).output;
      // Assert
      expect(actual).toEqual(expected);
    });

    it('resolves to the output directory form the args if set relative to the cwd.', () => {
      // Arrange
      const outputDirectory = 'path/to/output-dir';
      const expected = resolve('.', outputDirectory);
      args.output = outputDirectory;
      // Act
      const target = createTestTarget();
      const actual = (target.replacer as ZTokenReplacerFiles).output;
      // Assert
      expect(actual).toEqual(expected);
    });
  });

  describe('Output dictionary', () => {
    it('resolves to null if no output dictionary is set.', () => {
      // Arrange
      // Act
      // const target = createTestTarget();
      // Assert
      // expect(target.export).toBeNull();
    });

    it('resolves the output dictionary form the args if set relative to the cwd.', () => {
      // Arrange
      // const outputDictionary = 'path/to/output-dict';
      // const expected = resolve('.', outputDictionary);
      // args.export = outputDictionary;
      // Act
      // const target = createTestTarget();
      // Assert
      // expect(target.export).toEqual(expected);
    });
  });

  describe('Dictionary', () => {
    it('sets the dictionary to a keep strategy if quiet is set and no dictionary file is provided.', () => {
      // Arrange
      args.obey = true;
      // Act
      const target = createTestTarget();
      // Assert
      expect(target.dictionary).toBeInstanceOf(ZDictionaryReaderKeep);
    });

    it('sets the dictionary to a file strategy if dictionary file is provided.', () => {
      // Arrange
      args.dictionary = 'path/to/dictionary/file';
      // Act
      const target = createTestTarget();
      // Assert
      expect(target.dictionary).toBeInstanceOf(ZDictionaryReaderFile);
    });

    it('sets the dictionary to a stdin strategy if the quiet flag is not there and the dictionary file not provided.', () => {
      // Arrange
      // Act
      const target = createTestTarget();
      // Assert
      expect(target.dictionary).toBeInstanceOf(ZDictionaryReaderStdin);
    });

    describe('File strategy', () => {
      beforeEach(() => {
        args.dictionary = 'path/to/dictionary/file';
      });

      it('sets the file relative to the cwd.', () => {
        // Arrange
        const expected = resolve('.', args.dictionary);
        // Act
        const target = createTestTarget();
        const actual = target.dictionary as ZDictionaryReaderFile;
        // Assert
        expect(actual.file).toEqual(expected);
      });

      it('sets the fallback to keep if the quiet flag exists.', () => {
        // Arrange
        args.obey = true;
        // Act
        const target = createTestTarget();
        const actual = target.dictionary as ZDictionaryReaderFile;
        // Assert
        expect(actual.fallback).toBeInstanceOf(ZDictionaryReaderKeep);
      });

      it('sets the fallback to stdin if the quiet flag is falsy.', () => {
        // Arrange
        // Act
        const target = createTestTarget();
        const actual = target.dictionary as ZDictionaryReaderFile;
        // Assert
        expect(actual.fallback).toBeInstanceOf(ZDictionaryReaderStdin);
      });
    });
  });
});
