/// <reference types="parse" />
import { ParseClassExtender } from './parse-class-extender';
export declare type ParseAttributeKey<T extends Parse.Object> = keyof T['attributes'] | keyof Parse.BaseAttributes;
declare type WhereType<T extends Parse.Attributes> = (Partial<{
    $or?: Array<unknown>;
    $and?: Array<unknown>;
} & {
    [key in keyof (T & Parse.BaseAttributes)]: unknown;
}>);
export declare interface RequestQueryPayload<T extends Parse.Attributes> {
    project?: Partial<Array<keyof T>>;
    limit?: number;
    descending?: Partial<keyof T>;
    ascending?: Partial<keyof T>;
    skip?: number;
    include?: Partial<Array<keyof T>>;
    where: WhereType<T>;
    option?: Parse.FullOptions;
}
export declare interface RequestCountPayload<T extends Parse.Attributes> {
    where: WhereType<T>;
    limit?: number;
    option?: Parse.FullOptions;
    skip?: number;
}
declare interface AggregateDataType {
    option?: {
        useMasterKey?: boolean;
        sessionToken?: string;
    };
    pipeline: Array<{
        [key: string]: unknown;
    }>;
}
export declare class MongoToParseQueryBase {
    protected parse: any;
    protected setParse(parse: unknown): void;
    parseTable<T extends Parse.Attributes>(tableName: string): new () => ParseClassExtender<T>;
    get Cloud(): {
        run(name: string, parameters?: {
            [key: string]: unknown;
        }, options?: Parse.FullOptions): Promise<unknown>;
    };
    find<T extends Parse.Attributes>(table: new () => ParseClassExtender<T>, { project, where, option, descending, ascending, skip, include, limit }: RequestQueryPayload<T>): Promise<Array<InstanceType<typeof table>>>;
    findOne<T extends Parse.Attributes>(table: new () => ParseClassExtender<T>, { project, where, option, descending, ascending, skip, include, limit }: RequestQueryPayload<T>): Promise<InstanceType<typeof table>>;
    aggregate<T extends Parse.Attributes>(table: new () => Parse.Object<T>, { pipeline }: AggregateDataType): Promise<Array<unknown>>;
    count<T extends Parse.Attributes, Z extends ParseClassExtender<T>>(table: new () => Z, { where, option, skip, limit }: RequestCountPayload<T>): Promise<number>;
    addParseObjectInfoToJsonObject(jO: {
        [key: string]: unknown;
    }, className: string): {
        [key: string]: unknown;
    };
    removeParesObjectDetails(object: {
        [key: string]: unknown;
    }): void;
    saveAll<T extends Parse.Attributes>(items: Array<T>, option: Parse.FullOptions): Promise<void>;
    fetchObject<T extends Parse.Attributes, Z extends ParseClassExtender<T>>(item: Z, fieldCheck: Extract<keyof T, string>, option: Parse.FullOptions): Promise<Z>;
    getObjectsFromPointers<T extends Parse.Attributes, Z extends ParseClassExtender<T>>(items: Array<Z>, fieldCheck: Extract<keyof T, string>, option: Parse.FullOptions): Promise<Array<Z>>;
    updatePointersWithObject<T extends Parse.Attributes, Z extends ParseClassExtender<T>>(items: Array<Z>, fieldCheck: Extract<keyof T, string>, option: Parse.FullOptions): Promise<void>;
    getPointer<T extends Parse.Attributes, Z extends ParseClassExtender<T>>(object: Z): Z;
    getPointerFromId<T extends Parse.Attributes, Z extends ParseClassExtender<T>>(objectId: string, ParseTable: new () => Z): Z;
    private updateQuery;
    private updateQueryWithConditions;
    private generateKeyValueQuery;
    private generateWhereQuery;
}
export {};
