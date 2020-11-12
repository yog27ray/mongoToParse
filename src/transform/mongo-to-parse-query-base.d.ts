/// <reference types="parse" />
import 'reflect-metadata';
declare type ParseAttributeKey<T extends Parse.Object> = keyof (T['attributes'] & Parse.BaseAttributes);
declare type WhereAttributes<T extends Parse.Object> = keyof (T['attributes'] & Parse.BaseAttributes & {
    $or: Array<{
        [key in WhereAttributes<T>]: unknown;
    }>;
    $and: Array<{
        [key in WhereAttributes<T>]: unknown;
    }>;
});
declare interface QueryDataType<T extends Parse.Object> {
    select?: Array<ParseAttributeKey<T>>;
    limit?: number;
    descending?: Array<ParseAttributeKey<T>> | ParseAttributeKey<T>;
    ascending?: Array<ParseAttributeKey<T>> | ParseAttributeKey<T>;
    skip?: number;
    include?: Array<ParseAttributeKey<T>>;
    where: {
        [key in WhereAttributes<T>]?: unknown;
    };
    option?: Parse.FullOptions;
}
declare interface CountDataType<T extends Parse.Object> {
    where: {
        [key in WhereAttributes<T>]?: unknown;
    };
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
declare type ParseClassExtender<T extends Parse.Attributes> = (Parse.Object<T> & (new () => Parse.Object<T>));
declare class MongoToParseQueryBase {
    private parse;
    constructor(parse: any);
    parseTable<T extends Parse.Attributes>(tableName: string): ParseClassExtender<T>;
    get Cloud(): {
        run(name: string, parameters?: {
            [key: string]: unknown;
        }, options?: Parse.FullOptions): Promise<unknown>;
    };
    find<T extends Parse.Attributes, Z extends ParseClassExtender<T>>(table: Z, { select, where, option, descending, ascending, skip, include, limit }: QueryDataType<Z>): Promise<Array<Z>>;
    findOne<T extends Parse.Attributes, Z extends ParseClassExtender<T>>(table: Z, { select, where, option, descending, ascending, skip, include, limit }: QueryDataType<Z>): Promise<Z>;
    aggregate<T extends Parse.Attributes>(table: new () => Parse.Object<T>, { pipeline }: AggregateDataType): Promise<Array<unknown>>;
    count<T extends Parse.Attributes, Z extends ParseClassExtender<T>>(table: Z, { where, option, skip, limit }: CountDataType<Z>): Promise<number>;
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
    getObjectsFromPointers<T extends Parse.Attributes, Z extends ParseClassExtender<T>>(items: Array<Z>, fieldCheck: Extract<keyof T, string>, option: Parse.FullOptions): Promise<Array<Z>>;
    updatePointersWithObject<T extends Parse.Attributes>(items: Array<Parse.Object<T>>, fieldCheck: Extract<keyof T, string>, option: Parse.FullOptions): Promise<void>;
    getPointer<T extends Parse.Attributes>(object: Parse.Object<T>): Parse.Object<T>;
    getPointerFromId<T extends Parse.Attributes>(objectId: string, ParseTable: new () => Parse.Object<T>): Parse.Object<T>;
    private updateQuery;
    private updateQueryWithConditions;
    private generateKeyValueQuery;
    private generateWhereQuery;
}
export { MongoToParseQueryBase, ParseClassExtender };
