/// <reference types="parse" />
export declare class ParseUserExtender<T extends Parse.Attributes> extends Parse.User<T> {
    constructor(attributes?: T);
    save<K extends Extract<keyof T, string>>(attrs?: Pick<T, K> | T | null, options?: Parse.Object.SaveOptions): Promise<this>;
}
