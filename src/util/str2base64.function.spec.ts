import { str2base64 } from './str2base64.function';

describe('str2base64', () => {
  it('converts to base 64.', () => {
    // Arrange
    const target = 'convert-to-base-64';
    // Act
    const encoded = str2base64(target);
    const actual = Buffer.from(encoded, 'base64').toString('utf-8');
    // Assert
    expect(actual).toEqual(target);
  });
});
