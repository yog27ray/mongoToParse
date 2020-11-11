/// <reference types="parse" />
import 'reflect-metadata';
declare interface CountDataType {
    where: {
        [key: string]: unknown;
    };
    limit?: number;
    option?: Parse.FullOptions;
    skip?: number;
}
declare type ParseAttributeKey<T extends Parse.Object> = keyof T['attributes'] | keyof Parse.BaseAttributes;
declare interface QueryDataType<T extends Parse.Object> {
    select?: Array<ParseAttributeKey<T>>;
    limit?: number;
    descending?: ParseAttributeKey<T>;
    ascending?: ParseAttributeKey<T>;
    skip?: number;
    include?: Array<ParseAttributeKey<T>>;
    where: {
        [key in ParseAttributeKey<T>]?: unknown;
    };
    option?: Parse.FullOptions;
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
interface ParseObjectConstructor<T extends Parse.Attributes> extends Parse.ObjectStatic {
    new (className?: string, attributes?: T, options?: any): Parse.Object<T>;
}
declare type ParseClass<T extends Parse.Attributes = Parse.Attributes> = ParseObjectConstructor<T>;
declare class MongoToParseQueryBase {
    private parse;
    constructor(parse: any);
    parseTable<T extends Parse.Attributes>(tableName: string): ParseClass<T>;
    get Cloud(): {
        run(name: string, parameters?: {
            [key: string]: unknown;
        }, options?: Parse.FullOptions): Promise<unknown>;
    };
    find<T extends Parse.Attributes, Z extends Parse.Object<T>>(table: ParseClass<T>, { select, where, option, descending, ascending, skip, include, limit }: QueryDataType<Z>): Promise<Array<Parse.Object<T>>>;
    findOne<T extends Parse.Attributes, Z extends Parse.Object<T>>(table: ParseClass<T>, { select, where, option, descending, ascending, skip, include, limit }: QueryDataType<Z>): Promise<Parse.Object<T>>;
    aggregate<T extends Parse.Attributes>(table: ParseClass<T>, { pipeline }: AggregateDataType): Promise<Array<unknown>>;
    count<T extends Parse.Attributes>(table: ParseClass<T>, { where, option, skip, limit }: CountDataType): Promise<number>;
    addParseObjectInfoToJsonObject(jO: {
        [key: string]: unknown;
    }, className: string): {
        [key: string]: unknown;
    };
    removeParesObjectDetails(object: {
        [key: string]: unknown;
    }): void;
    saveAll<T extends Parse.Attributes>(items: Array<Parse.Object<T>>, option: Parse.FullOptions): Promise<void>;
    fetchObject<T extends Parse.Attributes>(item: Parse.Object<T>, fieldCheck: Extract<keyof T, string>, option: Parse.FullOptions): Promise<Parse.Object<T>>;
    getObjectsFromPointers<T extends Parse.Attributes>(items: Array<Parse.Object<T>>, fieldCheck: Extract<keyof T, string>, option: Parse.FullOptions): Promise<Array<Parse.Object<T>>>;
    updatePointersWithObject<T extends Parse.Attributes>(items: Array<Parse.Object<T>>, fieldCheck: Extract<keyof T, string>, option: Parse.FullOptions): Promise<void>;
    getPointer<T extends Parse.Attributes>(object: Parse.Object<T>): Parse.Object<T>;
    getPointerFromId<T extends Parse.Attributes>(objectId: string, ParseTable: ParseClass<T>): Parse.Object<T>;
    private updateQuery;
    private updateQueryWithConditions;
    private generateKeyValueQuery;
    private generateWhereQuery;
}
export { MongoToParseQueryBase, ParseClass };
