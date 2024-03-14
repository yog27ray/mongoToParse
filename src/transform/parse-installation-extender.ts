import { ParseObjectJSON } from './parse-type';

export declare class ParseInstallationExtender<T extends Parse.Attributes = Parse.Attributes> extends Parse.Installation<T> {
  static className: string;
  json?: ParseObjectJSON<T>;

  constructor(attributes?: T);

  _toJSON(): ParseObjectJSON<T>;

  // @ts-expect-error this is intentional type override
  toJSON(): ParseObjectJSON<T>;

  save<K extends Extract<keyof T, string>>(
    attrs?: Pick<T, K> | T | null,
    options?: Parse.Object.SaveOptions,
  ): Promise<this>;
}
