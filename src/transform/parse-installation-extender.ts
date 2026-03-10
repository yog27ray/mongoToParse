import ParseInstallation from 'parse/types/ParseInstallation';
import { Attributes, SaveOptions } from 'parse/types/ParseObject';
import { ParseObjectJSON } from './parse-type';

export declare class ParseInstallationExtender<T extends Attributes = Attributes> extends ParseInstallation<T> {
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
