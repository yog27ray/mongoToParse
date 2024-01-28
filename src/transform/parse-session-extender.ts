export declare class ParseSessionExtender<T extends Parse.Attributes> extends Parse.Session<T> {
  constructor(attributes?: T);

  save<K extends Extract<keyof T, string>>(
    attrs?: Pick<T, K> | T | null,
    options?: Parse.Object.SaveOptions,
  ): Promise<this>;
}
