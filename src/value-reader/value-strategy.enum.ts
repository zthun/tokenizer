export enum ZValueStrategy {
  Leave = 'Leave variable as is.',
  Empty = 'Set it to the empty string.',
  Null = 'Set it to null.',
  True = 'Set it to true.',
  False = 'Set it to false.',
  String = 'Enter a string.',
  Base64 = 'Enter a string and encode to base64.',
  Number = 'Enter a number.'
}
