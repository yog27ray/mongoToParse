import {
  InstallationConstructor,
  ObjectConstructor,
  RoleConstructor,
  SessionConstructor,
  UserConstructor,
} from 'parse';
import { MongoToParseError } from '../error/mongo-to-parse-error';
import { ParseObjectExtender } from './parse-object-extender';
import { ParseSchemaExtender } from './parse-schema-extender';
import { ParseUserExtender } from './parse-user-extender';

export declare type ParseAttributeKey<T extends Parse.Object> = keyof T['attributes'] | keyof Parse.BaseAttributes;

declare type WhereType<T extends Parse.Attributes> = (
  Partial<{ $or?: Array<unknown>, $and?: Array<unknown> } & { [key in keyof (T & Parse.BaseAttributes)]: unknown }>);

export declare interface RequestQueryPayload<Z extends ParseObjectExtender> {
  project?: Partial<Array<keyof (Z['attributes'] & Parse.BaseAttributes)>>;
  limit?: number;
  descending?: Partial<keyof (Z['attributes'] & Parse.BaseAttributes)>;
  ascending?: Partial<keyof (Z['attributes'] & Parse.BaseAttributes)>;
  skip?: number;
  hint?: string;
  include?: Partial<Array<keyof (Z['attributes'] & Parse.BaseAttributes)>>;
  where: WhereType<Z['attributes'] & Parse.BaseAttributes>;
  option?: Parse.FullOptions;
}

export declare type ParseObjectTriggerRequest<
  T extends ParseObjectExtender,
  Z extends ParseUserExtender = ParseUserExtender
> = Omit<Parse.Cloud.TriggerRequest<T>, 'user'> & { user?: Z };
export declare type ParseObjectBeforeLoginRequest<T extends ParseUserExtender> = ParseObjectTriggerRequest<T>;
export declare type ParseObjectAfterLoginRequest<T extends ParseUserExtender> = ParseObjectTriggerRequest<T>;
export declare type ParseObjectBeforeFindRequest<
  T extends ParseObjectExtender,
  Z extends ParseUserExtender = ParseUserExtender
> = Omit<Parse.Cloud.BeforeFindRequest<T>, 'user'> & { user?: Z };
export declare type ParseObjectAfterFindRequest<
  T extends ParseObjectExtender,
  Z extends ParseUserExtender = ParseUserExtender
> = Omit<Parse.Cloud.AfterFindRequest<T>, 'user'> & { user?: Z };
export declare type ParseObjectBeforeSaveRequest<
  T extends ParseObjectExtender,
  Z extends ParseUserExtender = ParseUserExtender
> = Omit<Parse.Cloud.BeforeSaveRequest<T>, 'user'> & { user?: Z };
export declare type ParseObjectAfterSaveRequest<
  T extends ParseObjectExtender,
  Z extends ParseUserExtender = ParseUserExtender
> = Omit<Parse.Cloud.AfterSaveRequest<T>, 'user'> & { user?: Z };
export declare type ParseObjectBeforeDeleteRequest<
  T extends ParseObjectExtender,
  Z extends ParseUserExtender = ParseUserExtender
> = Omit<Parse.Cloud.BeforeDeleteRequest<T>, 'user'> & { user?: Z };
export declare type ParseObjectAfterDeleteRequest<
  T extends ParseObjectExtender,
  Z extends ParseUserExtender = ParseUserExtender
> = Omit<Parse.Cloud.AfterDeleteRequest<T>, 'user'> & { user?: Z };

export declare interface RequestCountPayload<Z extends ParseObjectExtender> {
  where: WhereType<Z['attributes'] & Parse.BaseAttributes>;
  limit?: number;
  option?: Parse.FullOptions;
  hint?: string;
  skip?: number;
}

declare interface AggregateDataType {
  hint?: string;
  option?: { useMasterKey?: boolean; sessionToken?: string };
  pipeline: Array<{ [key: string]: unknown }>;
}

declare interface UpdateQueryDataType<T extends Parse.Object> {
  project?: Array<ParseAttributeKey<T>>;
  limit?: number;
  descending?: Array<ParseAttributeKey<T>> | ParseAttributeKey<T>;
  ascending?: Array<ParseAttributeKey<T>> | ParseAttributeKey<T>;
  skip?: number;
  include?: Array<ParseAttributeKey<T>>;
}

const CompoundQueryKeys: Array<string> = ['$and', '$or'];
export class MongoToParseQueryBase {
  protected parse: typeof Parse;

  protected setParse(parse: typeof Parse): void {
    this.parse = parse;
  }

  getParse(): typeof Parse {
    return this.parse;
  }

  fromJSON<Z extends new() => ParseObjectExtender>(objectJSON: Record<string, unknown>): InstanceType<Z> {
    return this.parse.Object.fromJSON(objectJSON) as InstanceType<Z>;
  }

  parseTable<T extends Parse.Attributes>(tableName: string): new() => ParseObjectExtender<T> {
    return this.parse.Object.extend(tableName) as new() => ParseObjectExtender<T>;
  }

  get Cloud(): typeof Parse.Cloud {
    return this.parse.Cloud;
  }

  get Error(): typeof Parse.Error {
    return this.parse.Error;
  }

  getNewACL(): Parse.ACL {
    return new this.parse.ACL();
  }

  get User(): UserConstructor {
    return this.parse.User;
  }

  get Schema(): typeof ParseSchemaExtender {
    return this.parse.Schema;
  }

  get Object(): ObjectConstructor {
    return this.parse.Object;
  }

  get Installation(): InstallationConstructor {
    return this.parse.Installation;
  }

  get Role(): RoleConstructor {
    return this.parse.Role;
  }

  get Session(): SessionConstructor {
    return this.parse.Session;
  }

  find<Z extends new() => ParseObjectExtender>(
    table: Z,
    {
      project,
      where,
      option,
      descending,
      ascending,
      skip,
      include,
      limit,
      hint,
    }: RequestQueryPayload<InstanceType<Z>>)
    : Promise<Array<InstanceType<Z>>> {
    const query = this.generateWhereQuery(table, where);
    this.updateQuery(query, { project, descending, ascending, skip, include, limit });
    if (hint) {
      query.hint(hint);
    }
    return query.find(option);
  }

  findOne<Z extends new() => ParseObjectExtender>(
    table: Z,
    {
      project,
      where,
      option,
      descending,
      ascending,
      skip,
      include,
      limit,
      hint,
    }: RequestQueryPayload<InstanceType<Z>>)
    : Promise<InstanceType<Z>> {
    const query = this.generateWhereQuery(table, where);
    this.updateQuery(query, { project, descending, ascending, skip, include, limit });
    if (hint) {
      query.hint(hint);
    }
    return query.first(option);
  }

  aggregate<Z extends new() => ParseObjectExtender>(table: Z, { pipeline, hint }: AggregateDataType): Promise<Array<unknown>> {
    const query = new this.parse.Query(table) as Parse.Query<Parse.Object<InstanceType<Z>['attributes']>>;
    if (hint) {
      query.hint(hint);
    }
    return query.aggregate(pipeline);
  }

  count<Z extends new() => ParseObjectExtender>(
    table: Z,
    { where, option, skip, limit, hint }: RequestCountPayload<InstanceType<Z>>): Promise<number> {
    const query = this.generateWhereQuery(table, where);
    this.updateQuery(query, { skip, limit });
    if (hint) {
      query.hint(hint);
    }
    return query.count(option);
  }

  addParseObjectInfoToJsonObject(jO: { [key: string]: unknown }, className: string): { [key: string]: unknown } {
    if (!jO || !jO.objectId) {
      return jO;
    }
    const jsonObject = jO;
    jsonObject.className = className;
    jsonObject.__type = 'Object';
    if (Object.keys(jsonObject).length <= 3) {
      jsonObject.__type = 'Pointer';
    }
    return jO;
  }

  removeParesObjectDetails(object: { [key: string]: unknown }): void {
    if (!object) {
      return;
    }
    const parseObject = object;
    delete parseObject.className;
    delete parseObject.__type;
  }

  async saveAll<T extends Parse.Object>(items: Array<T>, option: Parse.FullOptions): Promise<void> {
    await this.parse.Object.saveAll(items, option);
  }

  async destroyAll<T extends Parse.Object>(items: Array<T>, option: Parse.FullOptions): Promise<void> {
    await this.parse.Object.destroyAll(items, option);
  }

  async fetchObject<Z extends ParseObjectExtender>(
    item: Z,
    fieldCheck: Extract<keyof Z['attributes'], string>,
    option: Parse.FullOptions): Promise<Z> {
    if (!item) {
      return item;
    }
    if (!item.has(fieldCheck)) {
      await item.fetch(option);
    }
    return item;
  }

  async getObjectsFromPointers<Z extends ParseObjectExtender>(
    items: Array<Z>,
    fieldCheck: Extract<keyof Z['attributes'], string>,
    option: Parse.FullOptions): Promise<Array<Z>> {
    const pointers = items.filter((item: Z) => !item.has(fieldCheck));
    if (!pointers.length) {
      return items;
    }
    const Table = this.parseTable<Z['attributes']>(items[0].className) as new() => Z;
    const objects = await this.find(Table, {
      // @ts-expect-error objectId will be present
      where: { objectId: pointers.map((pointer: Parse.Object<Z['attributes']>) => pointer.id) },
      option,
    });
    return items.map((item: Z): Z => {
      if (item.has(fieldCheck)) {
        return item;
      }
      return objects.find((object: Z): boolean => (object.id === item.id));
    })
      .filter((item: Z) => !!item);
  }

  async updatePointersWithObject<Z extends ParseObjectExtender>(items: Array<Z>,
    fieldCheck: Extract<keyof Z['attributes'], string>, option: Parse.FullOptions): Promise<void> {
    const pointers = items.filter((item: Z) => !item.has(fieldCheck));
    if (!pointers.length) {
      return;
    }
    await Promise.all(pointers.map((pointer: Z) => pointer.fetch(option)
      .catch((error: Error & { code: number }) => {
        if (error.code === 101 && error.message === 'Object not found.') {
          return Promise.resolve();
        }
        return Promise.reject(error);
      })));
  }

  getPointer<Z extends ParseObjectExtender>(object: Z): Z {
    const Table = this.parseTable<Z['attributes']>(object.className);
    const pointer = new Table() as Z;
    pointer.id = object.id;
    return pointer;
  }

  getPointerFromId<Z extends new() => ParseObjectExtender>(
    objectId: string,
    ParseTable: Z): InstanceType<Z> {
    const pointer = new ParseTable();
    pointer.id = objectId;
    return pointer as InstanceType<Z>;
  }

  private updateQuery<Z extends ParseObjectExtender>(
    query: Parse.Query<Z>,
    { project, descending, ascending, skip, include, limit }: UpdateQueryDataType<Parse.Object<Z['attributes']>>): void {
    if (descending) {
      query.descending(descending);
    }
    if (project && project.length) {
      query.select(...project);
    }
    if (ascending) {
      query.ascending(ascending);
    }
    if (skip) {
      query.skip(skip);
    }
    if (limit) {
      query.limit(limit);
    }
    if (include) {
      include.forEach((field: keyof Z['attributes']) => query.include(field));
    }
  }

  private updateQueryWithConditions<Z extends ParseObjectExtender>(
    query: Parse.Query<Z>,
    field: ParseAttributeKey<Z>,
    value: unknown): Parse.Query<Z> {
    if ((field as string).startsWith('$')) {
      throw new MongoToParseError({
        code: 400,
        message: `field "${field as string}" is invalid syntax`,
        type: 'INVALID_QUERY',
      });
    }
    if (typeof value !== 'object') {
      return this.updateQueryWithConditions(query, field, { $eq: value });
    }
    const valueKeys = Object.keys(value);
    const queryConditionKeys = valueKeys.filter((each: string) => each.startsWith('$'));
    if (!queryConditionKeys.length) {
      return this.updateQueryWithConditions(query, field, { $eq: value });
    }
    if (queryConditionKeys.length !== valueKeys.length) {
      throw new MongoToParseError({
        code: 400,
        message: `${JSON.stringify(value)} invalid query syntax`,
        type: 'INVALID_QUERY',
      });
    }
    queryConditionKeys.forEach((queryConditionKey: string) => {
      switch (queryConditionKey) {
        case '$endsWith': {
          query.endsWith(field, value[queryConditionKey] as string);
          return;
        }
        case '$startsWith': {
          query.startsWith(field, value[queryConditionKey] as string);
          return;
        }
        case '$gt': {
          query.greaterThan(field, value[queryConditionKey] as Z['attributes'][ParseAttributeKey<Z>]);
          return;
        }
        case '$lt': {
          query.lessThan(field, value[queryConditionKey] as Z['attributes'][ParseAttributeKey<Z>]);
          return;
        }
        case '$gte': {
          query.greaterThanOrEqualTo(field, value[queryConditionKey] as Z['attributes'][ParseAttributeKey<Z>]);
          return;
        }
        case '$lte': {
          query.lessThanOrEqualTo(field, value[queryConditionKey] as Z['attributes'][ParseAttributeKey<Z>]);
          return;
        }
        case '$options': {
          return;
        }
        case '$regex': {
          const regexValue = value as { $options: string };
          query.matches(field, regexValue[queryConditionKey] as RegExp, regexValue.$options);
          return;
        }
        case '$exists': {
          if (value[queryConditionKey]) {
            query.exists(field);
          } else {
            query.doesNotExist(field);
          }
          return;
        }
        case '$nin':
        case '$ne': {
          if (value[queryConditionKey] instanceof Array) {
            if (value[queryConditionKey].length === 1) {
              query.notEqualTo(field, value[queryConditionKey][0] as Z['attributes'][ParseAttributeKey<Z>]);
              return;
            }
            query.notContainedIn(field, value[queryConditionKey] as Z['attributes'][ParseAttributeKey<Z>]);
            return;
          }
          query.notEqualTo(field, value[queryConditionKey] as Z['attributes'][ParseAttributeKey<Z>]);
          return;
        }
        case '$in':
        case '$eq': {
          if (value[queryConditionKey] instanceof Array) {
            if (value[queryConditionKey].length === 1) {
              query.equalTo(field, value[queryConditionKey][0] as Z['attributes'][ParseAttributeKey<Z>]);
              return;
            }
            query.containedIn(field, value[queryConditionKey] as Z['attributes'][ParseAttributeKey<Z>]);
            return;
          }
          query.equalTo(field, value[queryConditionKey] as Z['attributes'][ParseAttributeKey<Z>]);
          return;
        }
        case '$all': {
          if (value[queryConditionKey] instanceof Array) {
            query.containsAll(field, value[queryConditionKey] as Array<unknown>);
            return;
          }
          query.containsAll(field, [value[queryConditionKey]]);
          return;
        }
        default: {
          throw new MongoToParseError({
            code: 400,
            message: `${queryConditionKey} unhandled query syntax`,
            type: 'INVALID_QUERY',
          });
        }
      }
    });
    return query;
  }

  private generateKeyValueQuery<Z extends new() => ParseObjectExtender>(
    table: Z,
    key: string,
    value: unknown,
    query: Parse.Query<InstanceType<Z>> = new this.parse.Query(table) as Parse.Query<InstanceType<Z>>): Parse.Query<InstanceType<Z>> {
    switch (key) {
      case '$and': {
        const valueArray = value as Array<{ [key: string]: unknown }>;
        const queries = valueArray.map((condition: { [key: string]: unknown }) => this.generateWhereQuery(table, condition));
        return this.parse.Query.and(...queries) as Parse.Query<InstanceType<Z>>;
      }
      case '$or': {
        const valueArray = value as Array<{ [key: string]: unknown }>;
        const queries = valueArray.map((condition: { [key: string]: unknown }) => this.generateWhereQuery(table, condition));
        return this.parse.Query.or(...queries) as Parse.Query<InstanceType<Z>>;
      }
      default: {
        return this.updateQueryWithConditions(query, key, value);
      }
    }
  }

  private generateWhereQuery<Z extends new() => ParseObjectExtender>(
    table: Z,
    where: { [key: string]: unknown }): Parse.Query<InstanceType<Z>> {
    let keys: Array<string> = Object.keys(where);
    let query = new this.parse.Query(table) as Parse.Query<InstanceType<Z>>;
    const compoundKeysInQuery = keys.filter((key: string) => CompoundQueryKeys.includes(key));
    if (compoundKeysInQuery.length) {
      const queries = compoundKeysInQuery.map((key: string) => this.generateKeyValueQuery(table, key, where[key]));
      keys = keys.filter((key: string) => !compoundKeysInQuery.includes(key));
      query = (queries.length === 1
        ? queries[0]
        : this.getParse().Query.and(...queries)) as Parse.Query<InstanceType<Z>>;
    }
    keys.forEach((key: string) => this.generateKeyValueQuery(table, key, where[key], query));
    return query;
  }
}
