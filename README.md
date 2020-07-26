# Description

Tokenizer is a small token replacement application that can be used to replace variables in files.

This application is useful for building static files where the overlying application does not support the use of environment variables.

## Usage

```sh
tokenizer [options]
```

## Options

| Option               | Alias | Description                                                                                                                                    | Required? |
| -------------------- | ----- | ---------------------------------------------------------------------------------------------------------------------------------------------- | --------- |
| --inputFile          | -i    | The file to make replacements on                                                                                                               | True      |
| --outputFile         | -o    | The file to output. Uses the console if no file is provided.                                                                                   | False     |
| --dictionaryFile     | -d    | The path to the json dictionary file. Will ask you for each variable value if not specified.                                                   | False     |
| --saveDictionaryFile | -s    | The path to save the dictionary file to. Can be combined with dictionaryFile to specify missing values                                         | False     |
| --quiet              | -q    | Does not ask for any dictionary values. Useless if dictionaryFile is not provided. Any keys missing from the dictionaryFile will be preserved. | False     |

## API

You can also use this programmatically if needed.

```ts
import { ZTokenizer, ZDictionaryReaderStdIn } from '@zthun/tokenizer';

const input = 'path/to/input/file';
const reader = new ZDictionaryReaderStdIn();

const app = new ZTokenizer(inputFile, reader /* outputFile */);
app
  .run()
  .then((result) => console.log('SUCCESS'))
  .catch((err) => console.error(err));
```
