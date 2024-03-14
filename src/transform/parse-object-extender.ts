import { ParseObjectJSON } from './parse-type';

export declare class ParseObjectExtender<T extends Parse.Attributes = Parse.Attributes> extends Parse.Object<T> {
  static className: string;
  json?: ParseObjectJSON<T>;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(className?: string, attributes?: T, options?: any);

  _toJSON(): ParseObjectJSON<T>;

  // @ts-expect-error this is intentional type override
  toJSON(): ParseObjectJSON<T>;

  save<K extends Extract<keyof T, string>>(
    attrs?: Pick<T, K> | T | null,
    options?: Parse.Object.SaveOptions,
  ): Promise<this>;
}
