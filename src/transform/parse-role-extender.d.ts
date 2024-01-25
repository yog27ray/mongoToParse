/// <reference types="parse" />
export declare class ParseRoleExtender<T extends Parse.Attributes> extends Parse.Role<T> {
    constructor(name: string, acl: Parse.ACL);
    save<K extends Extract<keyof T, string>>(attrs?: Pick<T, K> | T | null, options?: Parse.Object.SaveOptions): Promise<this>;
}
