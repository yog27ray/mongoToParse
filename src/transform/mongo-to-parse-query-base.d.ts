/// <reference types="parse" />
declare type ParseAttributeKey<T extends Parse.Object> = keyof (T['attributes'] & Parse.BaseAttributes);
declare type WhereAttributes<T extends Parse.Object> = keyof (T['attributes'] & Parse.BaseAttributes & {
    $or: Array<{
        [key in WhereAttributes<T>]: unknown;
    }>;
    $and: Array<{
        [key in WhereAttributes<T>]: unknown;
    }>;
});
export declare interface RequestQueryPayload<T extends Parse.Object = Parse.Object> {
    project?: Array<ParseAttributeKey<T>>;
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
export declare interface RequestCountPayload<T extends Parse.Object = Parse.Object> {
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
export declare type ParseClassExtender<T extends Parse.Attributes> = (Parse.Object<T & Parse.BaseAttributes> & (new () => ParseClassExtender<T>));
export declare class MongoToParseQueryBase {
    protected parse: any;
    protected setParse(parse: unknown): void;
    parseTable<T extends Parse.Attributes>(tableName: string): ParseClassExtender<T>;
    get Cloud(): {
        run(name: string, parameters?: {
            [key: string]: unknown;
        }, options?: Parse.FullOptions): Promise<unknown>;
    };
    find<T extends Parse.Attributes, Z extends ParseClassExtender<T>>(table: Z, { project, where, option, descending, ascending, skip, include, limit }: RequestQueryPayload<Z>): Promise<Array<Z>>;
    findOne<T extends Parse.Attributes, Z extends ParseClassExtender<T>>(table: Z, { project, where, option, descending, ascending, skip, include, limit }: RequestQueryPayload<Z>): Promise<Z>;
    aggregate<T extends Parse.Attributes>(table: new () => Parse.Object<T>, { pipeline }: AggregateDataType): Promise<Array<unknown>>;
    count<T extends Parse.Attributes, Z extends ParseClassExtender<T>>(table: Z, { where, option, skip, limit }: RequestCountPayload<Z>): Promise<number>;
    addParseObjectInfoToJsonObject(jO: {
        [key: string]: unknown;
    }, className: string): {
        [key: string]: unknown;
    };
    removeParesObjectDetails(object: {
        [key: string]: unknown;
    }): void;
    saveAll<T extends Parse.Attributes>(items: Array<Parse.Object<T>>, option: Parse.FullOptions): Promise<void>;
    fetchObject<T extends Parse.Attributes, Z extends ParseClassExtender<T>>(item: Z, fieldCheck: Extract<keyof T, string>, option: Parse.FullOptions): Promise<Z>;
    getObjectsFromPointers<T extends Parse.Attributes, Z extends ParseClassExtender<T>>(items: Array<Z>, fieldCheck: Extract<keyof T, string>, option: Parse.FullOptions): Promise<Array<Z>>;
    updatePointersWithObject<T extends Parse.Attributes, Z extends ParseClassExtender<T>>(items: Array<Z>, fieldCheck: Extract<keyof T, string>, option: Parse.FullOptions): Promise<void>;
    getPointer<T extends Parse.Attributes, Z extends ParseClassExtender<T>>(object: Z): Z;
    getPointerFromId<T extends Parse.Attributes, Z extends ParseClassExtender<T>>(objectId: string, ParseTable: Z): Z;
    private updateQuery;
    private updateQueryWithConditions;
    private generateKeyValueQuery;
    private generateWhereQuery;
}
export {};
