import ParseACL from 'parse/types/ParseACL';
import { Attributes, SaveOptions } from 'parse/types/ParseObject';
import ParseRole from 'parse/types/ParseRole';
import { ParseObjectJSON } from './parse-type';

export declare class ParseRoleExtender<T extends Attributes = Attributes> extends ParseRole<T> {
  static className: string;

  json?: ParseObjectJSON<T>;

  constructor(name?: string, acl?: ParseACL);

  _toJSON(): ParseObjectJSON<T>;

  // @ts-expect-error this is intentional type override
  toJSON(): ParseObjectJSON<T>;

  save<K extends Extract<keyof T, string>>(
    attrs?: Pick<T, K> | T | null,
    options?: SaveOptions,
  ): Promise<this>;
}
