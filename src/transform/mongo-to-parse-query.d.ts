/// <reference types="parse" />
declare interface CountDataType {
    where: any;
    limit?: number;
    option?: Parse.FullOptions;
    skip?: number;
}
declare interface QueryDataType {
    select?: Array<string>;
    where: any;
    limit?: number;
    option?: Parse.FullOptions;
    descending?: any;
    ascending?: any;
    skip?: number;
    include?: Array<string>;
}
declare interface AggregateDataType {
    option?: {
        useMasterKey?: boolean;
        sessionToken?: string;
    };
    pipeline: Array<any>;
}
declare class MongoToParseQuery {
    parseTable(tableName: string): new () => Parse.Object;
    findAll(table: any, { select, where, option, descending, ascending, skip, include, limit, }: QueryDataType): Promise<Array<Parse.Object>>;
    findFirst(table: any, { select, where, option, descending, ascending, skip, include, limit }: QueryDataType): Promise<Parse.Object>;
    aggregateQuery(table: any, { pipeline }: AggregateDataType): Promise<any>;
    count(table: any, { where, option, skip, limit }: CountDataType): Promise<any>;
    addParseObjectInfoToJsonObject(jO: any, className: string): any;
    removeParesObjectDetails(object: any): void;
    saveAll(items: any, option: Parse.FullOptions): Promise<any>;
    fetchObject(item: Parse.Object, fieldCheck: string, option: Parse.FullOptions): Promise<Parse.Object>;
    getObjectsFromPointers(items: Array<Parse.Object>, fieldCheck: string, option: Parse.FullOptions): Promise<Array<Parse.Object>>;
    updatePointersWithObject(items: Array<Parse.Object>, fieldCheck: string, option: Parse.FullOptions): Promise<void>;
    getPointer(object: Parse.Object): Parse.Object;
    getPointerFromId(objectId: string, ParseTable: new () => Parse.Object): Parse.Object;
    private updateQuery;
    private updateQueryWithConditions;
    private generateKeyValueQuery;
    private generateWhereQuery;
}
export { MongoToParseQuery };
