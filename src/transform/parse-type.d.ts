import { ACL, File, GeoPoint, JSONBaseAttributes, Polygon, Relation } from 'parse';
import { ParseInstallationExtender } from './parse-installation-extender';
import { ParseObjectExtender } from './parse-object-extender';
import { ParseRoleExtender } from './parse-role-extender';
import { ParseSessionExtender } from './parse-session-extender';
import { ParseUserExtender } from './parse-user-extender';
type Encode<T> = T extends ParseObjectExtender ? ReturnType<T['_toJSON']> : T extends ParseUserExtender ? ReturnType<T['_toJSON']> : T extends ParseRoleExtender ? ReturnType<T['_toJSON']> : T extends ParseSessionExtender ? ReturnType<T['_toJSON']> : T extends ParseInstallationExtender ? ReturnType<T['_toJSON']> : T extends ACL | GeoPoint | Polygon | Relation | File ? ReturnType<T['toJSON']> : T extends Date ? {
    __type: 'Date';
    iso: string;
} : T extends RegExp ? string : T extends Array<infer R> ? Array<Encode<R>> : T extends object ? ToJSON<T> : T;
type ToJSON<T> = {
    [K in keyof T]: K extends keyof JSONBaseAttributes ? T[K] : Encode<T[K]>;
};
export type ParseObjectJSON<T> = ToJSON<T> & JSONBaseAttributes;
export {};
