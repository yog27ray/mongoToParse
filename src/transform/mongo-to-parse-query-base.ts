import { MongoToParseError } from '../error/mongo-to-parse-error';
import { ParseClassExtender, ParseClassType } from './parse-class-extender';

export declare type ParseAttributeKey<T extends Parse.Object> = keyof T['attributes'] | keyof Parse.BaseAttributes;

declare type WhereType<T extends Parse.Attributes> = (
  Partial<{ $or?: Array<unknown>, $and?: Array<unknown> } & { [key in keyof (T & Parse.BaseAttributes)]: unknown }>);

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
  protected parse: any;

  protected setParse(parse: unknown): void {
    this.parse = parse;
  }

  parseTable<T extends Parse.Attributes>(tableName: string): new () => ParseClassExtender<T> {
    return this.parse.Object.extend(tableName) as new () => ParseClassExtender<T>;
  }

  get Cloud(): { run(name: string, parameters?: { [key: string]: unknown }, options?: Parse.FullOptions): Promise<unknown> } {
    return {
      run: (name: string, parameters?: { [key: string]: unknown }, options?: Parse.FullOptions): Promise<unknown> => this.parse.Cloud
        .run(name, parameters, options) as Promise<unknown>,
    };
  }

  find<Z extends ParseClassType>(
    table: Z,
    { project, where, option, descending, ascending, skip, include, limit }: RequestQueryPayload<InstanceType<Z>["attributes"]>)
    : Promise<Array<InstanceType<Z>>> {
    const query = this.generateWhereQuery(table, where);
    this.updateQuery(query, { project, descending, ascending, skip, include, limit });
    return query.find(option) as Promise<Array<InstanceType<Z>>>;
  }

  findOne<Z extends ParseClassType>(
    table: Z,
    { project, where, option, descending, ascending, skip, include, limit }: RequestQueryPayload<InstanceType<Z>["attributes"]>)
    : Promise<InstanceType<Z>> {
    const query = this.generateWhereQuery(table, where);
    this.updateQuery(query, { project, descending, ascending, skip, include, limit });
    return query.first(option) as Promise<InstanceType<Z>>;
  }

  aggregate<Z extends ParseClassType>(table: Z, { pipeline }: AggregateDataType): Promise<Array<unknown>> {
    const query = new this.parse.Query(table) as Parse.Query<Parse.Object<InstanceType<Z>["attributes"]>>;
    return query.aggregate(pipeline);
  }

  count<Z extends ParseClassType>(
    table: Z,
    { where, option, skip, limit }: RequestCountPayload<InstanceType<Z>["attributes"]>): Promise<number> {
    const query = this.generateWhereQuery(table, where);
    this.updateQuery(query, { skip, limit });
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

  async fetchObject<Z extends ParseClassExtender>(
    item: Z,
    fieldCheck: Extract<keyof Z["attributes"], string>,
    option: Parse.FullOptions): Promise<Z> {
    if (!item) {
      return item;
    }
    if (!item.has(fieldCheck)) {
      await item.fetch(option);
    }
    return item;
  }

  async getObjectsFromPointers<Z extends ParseClassExtender>(
    items: Array<Z>,
    fieldCheck: Extract<keyof Z["attributes"], string>,
    option: Parse.FullOptions): Promise<Array<Z>> {
    const pointers = items.filter((item: Z) => !item.has(fieldCheck));
    if (!pointers.length) {
      return items;
    }
    const Table = this.parseTable<Z["attributes"]>(items[0].className) as new () => Z;
    const objects = await this.find<new () => Z>(Table, {
      // @ts-ignore
      where: { objectId: pointers.map((pointer: Parse.Object<Z["attributes"]>) => pointer.id) },
      option,
    }) as Array<Z>;
    return items.map((item: Z): Z => {
      if (item.has(fieldCheck)) {
        return item;
      }
      return objects.find((object: Z): boolean => (object.id === item.id));
    })
      .filter((item: Z) => !!item);
  }

  async updatePointersWithObject<Z extends ParseClassExtender>(items: Array<Z>,
    fieldCheck: Extract<keyof Z["attributes"], string>, option: Parse.FullOptions): Promise<void> {
    const pointers = items.filter((item: Z) => !item.has(fieldCheck));
    if (!pointers.length) {
      return;
    }
    await Promise.all(pointers.map((pointer: Z) => pointer.fetch(option)
      .catch((error: any) => {
        if (error.code === 101 && error.message === 'Object not found.') {
          return Promise.resolve();
        }
        return Promise.reject(error);
      })));
  }

  getPointer<Z extends ParseClassExtender>(object: Z): Z {
    const Table = this.parseTable<Z["attributes"]>(object.className);
    const pointer = new Table() as Z;
    pointer.id = object.id;
    return pointer;
  }

  getPointerFromId<Z extends ParseClassType>(
    objectId: string,
    ParseTable: Z): InstanceType<Z> {
    const pointer = new ParseTable();
    pointer.id = objectId;
    return pointer as InstanceType<Z>;
  }

  private updateQuery<Z extends ParseClassExtender>(
    query: Parse.Query<Z>,
    { project, descending, ascending, skip, include, limit }: UpdateQueryDataType<Parse.Object<Z["attributes"]>>): void {
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
      include.forEach((field: keyof Z["attributes"]) => query.include(field));
    }
  }

  private updateQueryWithConditions<Z extends ParseClassExtender>(
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
          query.endsWith(field, value[queryConditionKey]);
          return;
        }
        case '$startsWith': {
          query.startsWith(field, value[queryConditionKey]);
          return;
        }
        case '$gt': {
          query.greaterThan(field, value[queryConditionKey]);
          return;
        }
        case '$lt': {
          query.lessThan(field, value[queryConditionKey]);
          return;
        }
        case '$gte': {
          query.greaterThanOrEqualTo(field, value[queryConditionKey]);
          return;
        }
        case '$lte': {
          query.lessThanOrEqualTo(field, value[queryConditionKey]);
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
              query.notEqualTo(field, value[queryConditionKey][0]);
              return;
            }
            query.notContainedIn(field, value[queryConditionKey]);
            return;
          }
          query.notEqualTo(field, value[queryConditionKey]);
          return;
        }
        case '$in':
        case '$eq': {
          if (value[queryConditionKey] instanceof Array) {
            if (value[queryConditionKey].length === 1) {
              query.equalTo(field, value[queryConditionKey][0]);
              return;
            }
            query.containedIn(field, value[queryConditionKey]);
            return;
          }
          query.equalTo(field, value[queryConditionKey]);
          return;
        }
        case '$all': {
          if (value[queryConditionKey] instanceof Array) {
            query.containsAll(field, value[queryConditionKey]);
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

  private generateKeyValueQuery<Z extends ParseClassType>(
    table: Z,
    key: string,
    value: unknown,
    query: Parse.Query<InstanceType<Z>> = new this.parse.Query(table)): Parse.Query<InstanceType<Z>> {
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
        return this.updateQueryWithConditions(query, key, value) as Parse.Query<InstanceType<Z>>;
      }
    }
  }

  private generateWhereQuery<Z extends ParseClassType>(
    table: Z,
    where: { [key: string]: unknown }): Parse.Query<InstanceType<Z>> {
    let keys: Array<string> = Object.keys(where);
    let query = new this.parse.Query(table) as Parse.Query<InstanceType<Z>>;
    const compoundKeysInQuery = keys.filter((key: string) => CompoundQueryKeys.includes(key));
    if (compoundKeysInQuery.length) {
      const queries = compoundKeysInQuery.map((key: string) => this.generateKeyValueQuery(table, key, where[key]));
      keys = keys.filter((key: string) => !compoundKeysInQuery.includes(key));
      query = queries.length === 1 ? queries[0] : this.parse.Query.and(...queries);
    }
    keys.forEach((key: string) => this.generateKeyValueQuery(table, key, where[key], query));
    return query;
  }
}
