import { InstallationConstructor, ObjectConstructor, RoleConstructor, SessionConstructor, UserConstructor } from 'parse';
import { ParseObjectExtender } from './parse-object-extender';
import { ParseSchemaExtender } from './parse-schema-extender';
import { ParseUserExtender } from './parse-user-extender';
export declare type ParseAttributeKey<T extends Parse.Object> = keyof T['attributes'] | keyof Parse.BaseAttributes;
declare type WhereType<T extends Parse.Attributes> = (Partial<{
    $or?: Array<unknown>;
    $and?: Array<unknown>;
} & {
    [key in keyof (T & Parse.BaseAttributes)]: unknown;
}>);
export declare interface RequestQueryPayload<Z extends ParseObjectExtender> {
    project?: Partial<Array<keyof (Z['attributes'] & Parse.BaseAttributes)>>;
    limit?: number;
    descending?: Partial<keyof (Z['attributes'] & Parse.BaseAttributes)>;
    ascending?: Partial<keyof (Z['attributes'] & Parse.BaseAttributes)>;
    skip?: number;
    include?: Partial<Array<keyof (Z['attributes'] & Parse.BaseAttributes)>>;
    where: WhereType<Z['attributes'] & Parse.BaseAttributes>;
    option?: Parse.FullOptions;
}
export declare type ParseObjectTriggerRequest<T extends ParseObjectExtender, Z extends ParseUserExtender = ParseUserExtender> = Omit<Parse.Cloud.TriggerRequest<T>, 'user'> & {
    user?: Z;
};
export declare type ParseObjectBeforeLoginRequest<T extends ParseUserExtender> = ParseObjectTriggerRequest<T>;
export declare type ParseObjectAfterLoginRequest<T extends ParseUserExtender> = ParseObjectTriggerRequest<T>;
export declare type ParseObjectBeforeFindRequest<T extends ParseObjectExtender, Z extends ParseUserExtender = ParseUserExtender> = Omit<Parse.Cloud.BeforeFindRequest<T>, 'user'> & {
    user?: Z;
};
export declare type ParseObjectAfterFindRequest<T extends ParseObjectExtender, Z extends ParseUserExtender = ParseUserExtender> = Omit<Parse.Cloud.AfterFindRequest<T>, 'user'> & {
    user?: Z;
};
export declare type ParseObjectBeforeSaveRequest<T extends ParseObjectExtender, Z extends ParseUserExtender = ParseUserExtender> = Omit<Parse.Cloud.BeforeSaveRequest<T>, 'user'> & {
    user?: Z;
};
export declare type ParseObjectAfterSaveRequest<T extends ParseObjectExtender, Z extends ParseUserExtender = ParseUserExtender> = Omit<Parse.Cloud.AfterSaveRequest<T>, 'user'> & {
    user?: Z;
};
export declare type ParseObjectBeforeDeleteRequest<T extends ParseObjectExtender, Z extends ParseUserExtender = ParseUserExtender> = Omit<Parse.Cloud.BeforeDeleteRequest<T>, 'user'> & {
    user?: Z;
};
export declare type ParseObjectAfterDeleteRequest<T extends ParseObjectExtender, Z extends ParseUserExtender = ParseUserExtender> = Omit<Parse.Cloud.AfterDeleteRequest<T>, 'user'> & {
    user?: Z;
};
export declare interface RequestCountPayload<Z extends ParseObjectExtender> {
    where: WhereType<Z['attributes'] & Parse.BaseAttributes>;
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
    protected parse: typeof Parse;
    protected setParse(parse: typeof Parse): void;
    getParse(): typeof Parse;
    fromJSON<Z extends new () => ParseObjectExtender>(objectJSON: Record<string, unknown>): InstanceType<Z>;
    parseTable<T extends Parse.Attributes>(tableName: string): new () => ParseObjectExtender<T>;
    get Cloud(): typeof Parse.Cloud;
    get Error(): typeof Parse.Error;
    getNewACL(): Parse.ACL;
    get User(): UserConstructor;
    get Schema(): typeof ParseSchemaExtender;
    get Object(): ObjectConstructor;
    get Installation(): InstallationConstructor;
    get Role(): RoleConstructor;
    get Session(): SessionConstructor;
    find<Z extends new () => ParseObjectExtender>(table: Z, { project, where, option, descending, ascending, skip, include, limit, }: RequestQueryPayload<InstanceType<Z>>): Promise<Array<InstanceType<Z>>>;
    findOne<Z extends new () => ParseObjectExtender>(table: Z, { project, where, option, descending, ascending, skip, include, limit, }: RequestQueryPayload<InstanceType<Z>>): Promise<InstanceType<Z>>;
    aggregate<Z extends new () => ParseObjectExtender>(table: Z, { pipeline }: AggregateDataType): Promise<Array<unknown>>;
    count<Z extends new () => ParseObjectExtender>(table: Z, { where, option, skip, limit }: RequestCountPayload<InstanceType<Z>>): Promise<number>;
    addParseObjectInfoToJsonObject(jO: {
        [key: string]: unknown;
    }, className: string): {
        [key: string]: unknown;
    };
    removeParesObjectDetails(object: {
        [key: string]: unknown;
    }): void;
    saveAll<T extends Parse.Object>(items: Array<T>, option: Parse.FullOptions): Promise<void>;
    destroyAll<T extends Parse.Object>(items: Array<T>, option: Parse.FullOptions): Promise<void>;
    fetchObject<Z extends ParseObjectExtender>(item: Z, fieldCheck: Extract<keyof Z['attributes'], string>, option: Parse.FullOptions): Promise<Z>;
    getObjectsFromPointers<Z extends ParseObjectExtender>(items: Array<Z>, fieldCheck: Extract<keyof Z['attributes'], string>, option: Parse.FullOptions): Promise<Array<Z>>;
    updatePointersWithObject<Z extends ParseObjectExtender>(items: Array<Z>, fieldCheck: Extract<keyof Z['attributes'], string>, option: Parse.FullOptions): Promise<void>;
    getPointer<Z extends ParseObjectExtender>(object: Z): Z;
    getPointerFromId<Z extends new () => ParseObjectExtender>(objectId: string, ParseTable: Z): InstanceType<Z>;
    private updateQuery;
    private updateQueryWithConditions;
    private generateKeyValueQuery;
    private generateWhereQuery;
}
export {};
