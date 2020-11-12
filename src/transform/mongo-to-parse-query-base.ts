import { injectable } from 'inversify';
// tslint:disable-next-line:no-import-side-effect
import 'reflect-metadata';
import { MongoToParseError } from '../error/mongo-to-parse-error';

declare type ParseAttributeKey<T extends Parse.Object> = keyof (T['attributes'] & Parse.BaseAttributes);

declare type WhereAttributes<T extends Parse.Object> = keyof (T['attributes'] & Parse.BaseAttributes
  & { $or: Array<{ [key in WhereAttributes<T>]: unknown }>, $and: Array<{ [key in WhereAttributes<T>]: unknown }> });

declare interface QueryDataType<T extends Parse.Object> {
  select?: Array<ParseAttributeKey<T>>;
  limit?: number;
  descending?: Array<ParseAttributeKey<T>> | ParseAttributeKey<T>;
  ascending?: Array<ParseAttributeKey<T>> | ParseAttributeKey<T>;
  skip?: number;
  include?: Array<ParseAttributeKey<T>>;
  where: { [key in WhereAttributes<T>]?: unknown; };
  option?: Parse.FullOptions;
}

declare interface CountDataType<T extends Parse.Object> {
  where: { [key in WhereAttributes<T>]?: unknown; };
  limit?: number;
  option?: Parse.FullOptions;
  skip?: number;
}

declare interface AggregateDataType {
  option?: { useMasterKey?: boolean; sessionToken?: string };
  pipeline: Array<{ [key: string]: unknown }>;
}

declare interface UpdateQueryDataType<T extends Parse.Object> {
  select?: Array<ParseAttributeKey<T>>;
  limit?: number;
  descending?: Array<ParseAttributeKey<T>> | ParseAttributeKey<T>;
  ascending?: Array<ParseAttributeKey<T>> | ParseAttributeKey<T>;
  skip?: number;
  include?: Array<ParseAttributeKey<T>>;
}

@injectable()
class MongoToParseQueryBase {
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  constructor(private parse: any) {
  }

  parseTable<T extends Parse.Attributes>(tableName: string): (new () => Parse.Object<T>) {
    return this.parse.Object.extend(tableName) as (new () => Parse.Object<T>);
  }

  get Cloud(): { run(name: string, parameters?: { [key: string]: unknown }, options?: Parse.FullOptions): Promise<unknown> } {
    return {
      run: (name: string, parameters?: { [key: string]: unknown }, options?: Parse.FullOptions): Promise<unknown> => this.parse.Cloud
        .run(name, parameters, options) as Promise<unknown>,
    };
  }

  find<T extends Parse.Attributes, Z extends Parse.Object<T>>(
    table: new () => Z,
    { select, where, option, descending, ascending, skip, include, limit }: QueryDataType<Z>)
    : Promise<Array<Z>> {
    const query = this.generateWhereQuery(table, where);
    this.updateQuery(query, { select, descending, ascending, skip, include, limit });
    return query.find(option);
  }

  findOne<T extends Parse.Attributes, Z extends Parse.Object<T>>(
    table: new () => Z,
    { select, where, option, descending, ascending, skip, include, limit }: QueryDataType<Z>): Promise<Z> {
    const query = this.generateWhereQuery(table, where);
    this.updateQuery(query, { select, descending, ascending, skip, include, limit });
    return query.first(option);
  }

  aggregate<T extends Parse.Attributes>(table: new () => Parse.Object<T>, { pipeline }: AggregateDataType): Promise<Array<unknown>> {
    const query = new this.parse.Query(table) as Parse.Query<Parse.Object<T>>;
    return query.aggregate(pipeline);
  }

  count<T extends Parse.Attributes, Z extends Parse.Object<T>>(table: new () => Z, { where, option, skip, limit }: CountDataType<Z>)
    : Promise<number> {
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

  async saveAll<T extends Parse.Attributes>(items: Array<Parse.Object<T>>, option: Parse.FullOptions): Promise<void> {
    await this.parse.Object.saveAll(items, option);
  }

  async fetchObject<T extends Parse.Attributes>(item: Parse.Object<T>, fieldCheck: Extract<keyof T, string>, option: Parse.FullOptions)
    : Promise<Parse.Object<T>> {
    if (!item) {
      return item;
    }
    if (!item.get(fieldCheck)) {
      await item.fetch(option);
    }
    return item;
  }

  async getObjectsFromPointers<T extends Parse.Attributes>(
    items: Array<Parse.Object<T>>,
    fieldCheck: Extract<keyof T, string>,
    option: Parse.FullOptions): Promise<Array<Parse.Object<T>>> {
    const pointers = items.filter((item: Parse.Object<T>) => !item.has(fieldCheck));
    if (!pointers.length) {
      return items;
    }
    const Table = this.parseTable<T>(items[0].className);
    const objects = await this.find(Table, {
      where: { objectId: pointers.map((pointer: Parse.Object<T>) => pointer.id) },
      option,
    });
    return items.map((item: Parse.Object<T>) => {
      if (item.has(fieldCheck)) {
        return item;
      }
      return objects.find((object: Parse.Object<T>) => (object.id === item.id));
    })
      .filter((item: Parse.Object) => !!item);
  }

  async updatePointersWithObject<T extends Parse.Attributes>(items: Array<Parse.Object<T>>, fieldCheck: Extract<keyof T, string>,
    option: Parse.FullOptions): Promise<void> {
    const pointers = items.filter((item: Parse.Object<T>) => !item.has(fieldCheck));
    if (!pointers.length) {
      return;
    }
    await Promise.all(pointers.map((pointer: Parse.Object<T>) => pointer.fetch(option)
      .catch((error: any) => {
        if (error.code === 101 && error.message === 'Object not found.') {
          return Promise.resolve();
        }
        return Promise.reject(error);
      })));
  }

  getPointer<T extends Parse.Attributes>(object: Parse.Object<T>): Parse.Object<T> {
    const Table = this.parseTable<T>(object.className);
    const pointer = new Table();
    pointer.id = object.id;
    return pointer;
  }

  getPointerFromId<T extends Parse.Attributes>(objectId: string, ParseTable: new () => Parse.Object<T>): Parse.Object<T> {
    const pointer = new ParseTable();
    pointer.id = objectId;
    return pointer;
  }

  private updateQuery<T extends Parse.Attributes>(
    query: Parse.Query<Parse.Object<T>>,
    { select, descending, ascending, skip, include, limit }: UpdateQueryDataType<Parse.Object<T>>): void {
    if (descending) {
      query.descending(descending);
    }
    if (select && select.length) {
      query.select(...select);
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
      include.forEach((field: keyof Parse.Object<T>['attributes']) => query.include(field));
    }
  }

  private updateQueryWithConditions<T extends Parse.Attributes>(
    query: Parse.Query<Parse.Object<T>>,
    field: ParseAttributeKey<Parse.Object<T>>,
    value: unknown): Parse.Query<Parse.Object<T>> {
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
          query.matches(field, regexValue[queryConditionKey], regexValue.$options);
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

  private generateKeyValueQuery<T extends Parse.Attributes, Z extends Parse.Object<T>>(
    table: new () => Z,
    key: string,
    value: unknown,
    query: Parse.Query<Parse.Object<T>> = new this.parse.Query(table)): Parse.Query<Parse.Object<T>> {
    switch (key) {
      case '$and': {
        const valueArray = value as Array<{ [key: string]: unknown }>;
        const queries = valueArray.map((condition: { [key: string]: unknown }) => this.generateWhereQuery(table, condition));
        return this.parse.Query.and(...queries) as Parse.Query<Parse.Object<T>>;
      }
      case '$or': {
        const valueArray = value as Array<{ [key: string]: unknown }>;
        const queries = valueArray.map((condition: { [key: string]: unknown }) => this.generateWhereQuery(table, condition));
        return this.parse.Query.or(...queries) as Parse.Query<Parse.Object<T>>;
      }
      default: {
        return this.updateQueryWithConditions(query, key, value);
      }
    }
  }

  private generateWhereQuery<T extends Parse.Attributes, Z extends Parse.Object<T>>(
    table: new () => Z,
    where: { [key: string]: unknown }): Parse.Query<Z> {
    const keys: Array<string> = Object.keys(where);
    const query = new this.parse.Query(table) as Parse.Query<Z>;
    const isCompoundQuery = ['$and', '$or'].some((key: string) => keys.includes(key));
    if (!isCompoundQuery) {
      keys.forEach((key: string) => this.generateKeyValueQuery(table, key, where[key], query));
      return query;
    }
    const queries = keys.map((key: string) => this.generateKeyValueQuery(table, key, where[key]));
    return this.parse.Query.and(...queries) as Parse.Query<Z>;
  }
}

export { MongoToParseQueryBase };
