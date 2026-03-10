import { Attributes, SaveOptions } from 'parse/types/ParseObject';
import ParseUser from 'parse/types/ParseUser';
import { ParseObjectJSON } from './parse-type';

export declare class ParseUserExtender<T extends Attributes = Attributes> extends ParseUser<T> {
  static className: string;

  json?: ParseObjectJSON<T>;

  constructor(attributes?: Partial<T>);

  _toJSON(): ParseObjectJSON<T>;

  // @ts-expect-error this is intentional type override
  toJSON(): ParseObjectJSON<T>;

  save<K extends Extract<keyof T, string>>(
    attrs?: Pick<T, K> | T | null,
    options?: SaveOptions,
  ): Promise<this>;
}
