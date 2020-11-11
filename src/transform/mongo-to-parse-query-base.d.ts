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
declare interface QueryDataType {
    select?: Array<string>;
    where: {
        [key: string]: unknown;
    };
    limit?: number;
    option?: Parse.FullOptions;
    descending?: string;
    ascending?: string;
    skip?: number;
    include?: Array<string>;
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
declare type ParseClass = (new () => Parse.Object) & Parse.Object;
declare class MongoToParseQueryBase {
    private parse;
    constructor(parse: any);
    parseTable<T extends ParseClass>(tableName: string): T;
    get Cloud(): {
        run(name: string, parameters?: {
            [key: string]: unknown;
        }, options?: Parse.FullOptions): Promise<unknown>;
    };
    find<T extends ParseClass>(table: T, { select, where, option, descending, ascending, skip, include, limit, }: QueryDataType): Promise<Array<T>>;
    findOne<T extends ParseClass>(table: T, { select, where, option, descending, ascending, skip, include, limit }: QueryDataType): Promise<Parse.Object>;
    aggregate<T extends ParseClass>(table: T, { pipeline }: AggregateDataType): Promise<Array<unknown>>;
    count<T extends ParseClass>(table: T, { where, option, skip, limit }: CountDataType): Promise<number>;
    addParseObjectInfoToJsonObject(jO: {
        [key: string]: unknown;
    }, className: string): {
        [key: string]: unknown;
    };
    removeParesObjectDetails(object: {
        [key: string]: unknown;
    }): void;
    saveAll<T extends ParseClass>(items: Array<T>, option: Parse.FullOptions): Promise<void>;
    fetchObject<T extends Parse.Object>(item: T, fieldCheck: string, option: Parse.FullOptions): Promise<T>;
    getObjectsFromPointers<T extends ParseClass>(items: Array<T>, fieldCheck: string, option: Parse.FullOptions): Promise<Array<T>>;
    updatePointersWithObject<T extends ParseClass>(items: Array<T>, fieldCheck: string, option: Parse.FullOptions): Promise<void>;
    getPointer<T extends ParseClass>(object: T): T;
    getPointerFromId<T extends ParseClass>(objectId: string, ParseTable: T): T;
    private updateQuery;
    private updateQueryWithConditions;
    private generateKeyValueQuery;
    private generateWhereQuery;
}
export { MongoToParseQueryBase, ParseClass };
