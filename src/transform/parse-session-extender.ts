import { Attributes, SaveOptions } from 'parse/types/ParseObject';
import ParseSession from 'parse/types/ParseSession';
import { ParseObjectJSON } from './parse-type';

export declare class ParseSessionExtender<T extends Attributes = Attributes> extends ParseSession<T> {
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
