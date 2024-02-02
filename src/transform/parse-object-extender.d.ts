/// <reference types="parse" />
import { ParseJSON } from './parse-type';
export declare class ParseObjectExtender<T extends Parse.Attributes = Parse.Attributes> extends Parse.Object<T> {
    json?: ParseJSON<T>;
    constructor(className?: string, attributes?: T, options?: any);
    toJSON(): ParseJSON<T>;
    save<K extends Extract<keyof T, string>>(attrs?: Pick<T, K> | T | null, options?: Parse.Object.SaveOptions): Promise<this>;
}
