/// <reference types="parse" />
import { ParseObjectJSON } from './parse-type';
export declare class ParseSessionExtender<T extends Parse.Attributes = Parse.Attributes> extends Parse.Session<T> {
    static className: string;
    json?: ParseObjectJSON<T>;
    constructor(attributes?: T);
    _toJSON(): ParseObjectJSON<T>;
    toJSON(): ParseObjectJSON<T>;
    save<K extends Extract<keyof T, string>>(attrs?: Pick<T, K> | T | null, options?: Parse.Object.SaveOptions): Promise<this>;
}
