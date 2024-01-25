export declare class ParseObjectExtender<T extends Parse.Attributes = Parse.Attributes> extends Parse.Object<T> {
  constructor(className?: string, attributes?: T, options?: any);

  save<K extends Extract<keyof T, string>>(
    attrs?: Pick<T, K> | T | null,
    options?: Parse.Object.SaveOptions,
  ): Promise<this>;
}

export type ParseClassExtender<T extends Parse.Attributes = Parse.Attributes> = new (
  className?: string, attributes?: T, options?: any) => ParseObjectExtender<T>;