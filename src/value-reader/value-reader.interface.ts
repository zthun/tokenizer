export interface IZValueReader {
  read(key: string): Promise<string | number | boolean>;
}
