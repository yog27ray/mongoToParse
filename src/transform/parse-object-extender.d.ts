/// <reference types="parse" />
import { toJSON } from './parse-type';
export declare class ParseObjectExtender<T extends Parse.Attributes = Parse.Attributes> extends Parse.Object<T> {
    json?: toJSON<T>;
    constructor(className?: string, attributes?: T, options?: any);
    toJSON(): toJSON<T>;
    save<K extends Extract<keyof T, string>>(attrs?: Pick<T, K> | T | null, options?: Parse.Object.SaveOptions): Promise<this>;
}
