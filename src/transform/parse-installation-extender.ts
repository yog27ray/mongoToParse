export declare class ParseInstallationExtender<T extends Parse.Attributes> extends Parse.Installation<T> {
  constructor(attributes?: T);

  save<K extends Extract<keyof T, string>>(
    attrs?: Pick<T, K> | T | null,
    options?: Parse.Object.SaveOptions,
  ): Promise<this>;
}
