/// <reference types="parse" />
import { ParseObjectJSON } from './parse-type';
export declare class ParseRoleExtender<T extends Parse.Attributes = Parse.Attributes> extends Parse.Role<T> {
    json?: ParseObjectJSON<T>;
    constructor(name?: string, acl?: Parse.ACL);
    _toJSON(): ParseObjectJSON<T>;
    toJSON(): ParseObjectJSON<T>;
    save<K extends Extract<keyof T, string>>(attrs?: Pick<T, K> | T | null, options?: Parse.Object.SaveOptions): Promise<this>;
}
