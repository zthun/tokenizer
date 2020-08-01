# Description

Tokenizer is a small token replacement application that can be used to replace token variables in files.

Tokens in a file use the same format as environment variables on unix systems.

> The ${color} ${animal} jumped over the \${object}.

If the variable dictionary for the above line is as follows, then the following output will be given.

```json
{
  "color": "brown",
  "animal": "fox",
  "object": "moon"
}
```

> The brown fox jumped over the moon.

## Installation

### Locally

```sh
# With NPM
npm install tokenizer --save-dev
# With Yarn
yarn add tokenizer --dev
```

### Globally

```sh
npm install -g tokenizer
```

## Usage

```sh
tokenizer <globs> [options]
```

## Options

All options are optional.

| Option       | Alias | Description                                                                                                         | Type    |
| ------------ | ----- | ------------------------------------------------------------------------------------------------------------------- | ------- |
| --output     | -o    | The directory to output all the tokenized files. Will dump all files to the console not set.                        | String  |
| --dictionary | -d    | The path to the json dictionary file. If not specified, you will be asked for each variable and what to do with it. | String  |
| --export     | -e    | The path to save the dictionary file to. Does not write out anything if this is not specified.                      | String  |
| --obey       | -q    | Do not ask for any dictionary values. Variable values that are missing will be kept.                                | Boolean |
| --silent     |       | Do not output anything. Useful if you just want to build a dictionary file.                                         | Boolean |
| --cwd        |       | Sets the current working directory. The directory structure in the output directory.                                | String  |
| --help       |       | Show help. Immediately exits the application afterward.                                                             | Boolean |
| --version    |       | Show version number. Immediately exists the application afterward.                                                  | Boolean |

## Config

You can actually run tokenizer without any globs or options by using a cosmiconfig enabled file. Simply add one of the following files to where you
run the tokenizer application and it will load up the config values from there.

- tokenizer.json
- tokenizer.config.js
- .tokenizerrc
- tokenizer.yaml
- tokenizer.yml

You can also add a tokenizer key in your package.json file with all the options you want. However, please be aware that the help and version options are ignored from the config file. The following is an example config file.

> tokenizer.json

```json
{
  "files": ["./json/*.json", "./yml/*.yml"],
  "output": "./__processed__",
  "export": "./__dictionary__/dictionary.json",
  "obey": false,
  "silent": false,
  "cwd": "."
}
```

## API

You can also use this programmatically.

```ts
import { ZTokenizer, ZTokenizerOptions } from '@zthun/tokenizer';

const options = new ZTokenizerOptions({
  files: ['./json/*.json', './yml/*.yml'],
  obey: true,
  dictionary: './dictionary.json',
  output: '__processed',
  export: '__processed/dictionary.json',
  cwd: '.',
  silent: false
});

const app = new ZTokenizer(options);
app
  .run()
  .then((result) => console.log('SUCCESS'))
  .catch((err) => console.error(err));
```
