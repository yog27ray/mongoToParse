import { toJSON } from './parse-type';

export declare class ParseUserExtender<T extends Parse.Attributes = Parse.Attributes> extends Parse.User<T> {
  json?: toJSON<T>;

  constructor(attributes?: T);

  // @ts-ignore
  toJSON(): toJSON<T>;

  save<K extends Extract<keyof T, string>>(
    attrs?: Pick<T, K> | T | null,
    options?: Parse.Object.SaveOptions,
  ): Promise<this>;
}
