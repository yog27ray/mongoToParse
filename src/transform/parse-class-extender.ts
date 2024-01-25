export declare interface ParseClassExtender<T extends Parse.Attributes = Parse.Attributes> extends Parse.Object<T> {
  new<T extends Parse.Attributes>(className: string, attributes: T, options?: any): ParseClassExtender<T>;
  new(className?: string, attributes?: Parse.Attributes, options?: any): Parse.Object;
  save<K extends Extract<keyof T, string>>(
    attrs?: Pick<T, K> | T | null,
    options?: Parse.Object.SaveOptions,
  ): Promise<this>;
}

export type ParseClassType<T extends Parse.Attributes = Parse.Attributes> = new () => ParseClassExtender<T>

export declare interface ParseRoleExtender<T extends Parse.Attributes> extends Parse.Role<T> {
  new<T extends Parse.Attributes>(name: string, acl: Parse.ACL): ParseRoleExtender<T>;
  new(name: string, acl: Parse.ACL): Parse.Role;

  save<K extends Extract<keyof T, string>>(
    attrs?: Pick<T, K> | T | null,
    options?: Parse.Object.SaveOptions,
  ): Promise<this>;
}
