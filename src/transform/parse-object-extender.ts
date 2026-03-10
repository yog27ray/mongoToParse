import { Attributes } from 'parse';
import ParseObject from 'parse/types/ParseObject';
import { ParseObjectJSON } from './parse-type';

export declare class ParseObjectExtender<T extends Attributes = Attributes> extends ParseObject<T> {
  static className: string;

  json?: ParseObjectJSON<T>;

  constructor(attributes?: Partial<T>);

  _toJSON(): ParseObjectJSON<T>;

  // @ts-expect-error this is intentional type override
  toJSON(): ParseObjectJSON<T>;

  save<K extends Extract<keyof T, string>>(
    attrs?: Pick<T, K> | T | null,
    options?: Parse.Object.SaveOptions,
  ): Promise<this>;
}
