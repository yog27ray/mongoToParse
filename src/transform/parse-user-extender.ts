import { toJSON } from './parse-type';

export declare class ParseUserExtender<T extends Parse.Attributes = Parse.Attributes> extends Parse.User<T> {
  json?: toJSON<T>;

  constructor(attributes?: T);

  // @ts-expect-error this is intentional type override
  toJSON(): toJSON<T>;

  save<K extends Extract<keyof T, string>>(
    attrs?: Pick<T, K> | T | null,
    options?: Parse.Object.SaveOptions,
  ): Promise<this>;
}
