import {ACL, File, GeoPoint, JSONBaseAttributes, Object, Pointer, Polygon, Relation} from 'parse';

type Encode<T> = T extends ParseObjectExtender ? ReturnType<T['toJSON']>
  : T extends ACL | GeoPoint | Polygon | Relation | File ? ReturnType<T['toJSON']>
    : T extends Date ? { __type: 'Date'; iso: string }
      : T extends RegExp ? string
        : T extends Array<infer R>
          // This recursion is unsupported in <=3.6
          ? Array<Encode<R>>
          : T extends object ? toJSON<T>
            : T;

type toJSON<T> = {
  [K in keyof T]: K extends keyof JSONBaseAttributes ? T[K] : Encode<T[K]>;
};

export declare class ParseObjectExtender<T extends Parse.Attributes = Parse.Attributes> extends Parse.Object<T> {
  json?: toJSON<T> & JSONBaseAttributes;

  constructor(className?: string, attributes?: T, options?: any);

  // @ts-ignore
  toJSON(): toJSON<T> & JSONBaseAttributes;

  save<K extends Extract<keyof T, string>>(
    attrs?: Pick<T, K> | T | null,
    options?: Parse.Object.SaveOptions,
  ): Promise<this>;
}
