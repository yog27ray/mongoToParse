import { injectable } from 'inversify';
// tslint:disable-next-line:no-import-side-effect
import 'reflect-metadata';
import { CureSkinError } from '../error/cure-skin-error';

declare interface CountDataType {
  where: { [key: string]: unknown };
  limit?: number;
  option?: Parse.FullOptions;
  skip?: number;
}

declare interface QueryDataType {
  select?: Array<string>;
  where: { [key: string]: unknown };
  limit?: number;
  option?: Parse.FullOptions;
  descending?: string;
  ascending?: string;
  skip?: number;
  include?: Array<string>;
}

declare interface AggregateDataType {
  option?: { useMasterKey?: boolean; sessionToken?: string };
  pipeline: Array<{ [key: string]: unknown }>;
}

declare interface UpdateQueryDataType {
  select?: Array<string>;
  limit: number;
  descending?: string;
  ascending?: string;
  skip: number;
  include?: Array<string>;
}

declare type ParseClass = (new () => Parse.Object) & Parse.Object;

@injectable()
class MongoToParseQueryBase {
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  constructor(private parse: any) {
  }

  parseTable<T extends ParseClass>(tableName: string): T {
    return this.parse.Object.extend(tableName) as T;
  }

  find<T extends ParseClass>(table: T, {
    select, where, option, descending, ascending, skip, include, limit,
  }: QueryDataType): Promise<Array<T>> {
    const query = this.generateWhereQuery(table, where);
    this.updateQuery(query, { select, descending, ascending, skip, include, limit });
    return query.find(option);
  }

  findOne<T extends ParseClass>(table: T, { select, where, option, descending, ascending, skip, include, limit }:
    QueryDataType): Promise<Parse.Object> {
    const query = this.generateWhereQuery(table, where);
    this.updateQuery(query, { select, descending, ascending, skip, include, limit });
    return query.first(option);
  }

  aggregate<T extends ParseClass>(table: T, { pipeline }: AggregateDataType): Promise<Array<unknown>> {
    const query = new this.parse.Query(table) as Parse.Query<T>;
    return query.aggregate(pipeline);
  }

  count<T extends ParseClass>(table: T, { where, option, skip, limit }: CountDataType): Promise<number> {
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

  async saveAll<T extends ParseClass>(items: Array<T>, option: Parse.FullOptions): Promise<void> {
    await this.parse.Object.saveAll(items, option);
  }

  async fetchObject<T extends Parse.Object>(item: T, fieldCheck: string, option: Parse.FullOptions): Promise<T> {
    if (!item) {
      return item;
    }
    if (!item.get(fieldCheck)) {
      await item.fetch(option);
    }
    return item;
  }

  async getObjectsFromPointers<T extends ParseClass>(items: Array<T>, fieldCheck: string, option: Parse.FullOptions): Promise<Array<T>> {
    const pointers = items.filter((item: T) => !item.has(fieldCheck));
    if (!pointers.length) {
      return items;
    }
    const Table = this.parseTable<T>(items[0].className);
    const objects = await this.find(Table, { where: { objectId: pointers.map((pointer: T) => pointer.id) }, option });
    return items.map((item: T) => {
      if (item.has(fieldCheck)) {
        return item;
      }
      return objects.find((object: Parse.Object) => (object.id === item.id));
    })
      .filter((item: Parse.Object) => !!item);
  }

  async updatePointersWithObject<T extends ParseClass>(items: Array<T>, fieldCheck: string, option: Parse.FullOptions): Promise<void> {
    const pointers = items.filter((item: T) => !item.has(fieldCheck));
    if (!pointers.length) {
      return;
    }
    await Promise.all(pointers.map((pointer: T) => pointer.fetch(option)
      .catch((error: any) => {
        if (error.code === 101 && error.message === 'Object not found.') {
          return Promise.resolve();
        }
        return Promise.reject(error);
      })));
  }

  getPointer<T extends ParseClass>(object: T): T {
    const Table = this.parseTable(object.className);
    const pointer = new Table();
    pointer.id = object.id;
    return pointer as T;
  }

  getPointerFromId<T extends ParseClass>(objectId: string, ParseTable: T): T {
    const pointer = new ParseTable();
    pointer.id = objectId;
    return pointer as T;
  }

  private updateQuery(query: Parse.Query, { select, descending, ascending, skip, include, limit }: UpdateQueryDataType): void {
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
      include.forEach((field: string) => query.include(field));
    }
  }

  private updateQueryWithConditions<T extends ParseClass>(query: Parse.Query<T>, field: string, value: unknown): Parse.Query<T> {
    if (field.startsWith('$')) {
      throw new CureSkinError({
        code: 400,
        message: `field "${field}" is invalid syntax`,
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
      throw new CureSkinError({
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
          throw new CureSkinError({
            code: 400,
            message: `${queryConditionKey} unhandled query syntax`,
            type: 'INVALID_QUERY',
          });
        }
      }
    });
    return query;
  }

  private generateKeyValueQuery<T extends ParseClass>(table: T, key: string, value: unknown,
    query: Parse.Query<T> = new this.parse.Query(table)): Parse.Query<T> {
    switch (key) {
      case '$and': {
        const valueArray = value as Array<{ [key: string]: unknown }>;
        const queries = valueArray.map((condition: { [key: string]: unknown }) => this.generateWhereQuery(table, condition));
        return this.parse.Query.and(...queries) as Parse.Query<T>;
      }
      case '$or': {
        const valueArray = value as Array<{ [key: string]: unknown }>;
        const queries = valueArray.map((condition: { [key: string]: unknown }) => this.generateWhereQuery(table, condition));
        return this.parse.Query.or(...queries) as Parse.Query<T>;
      }
      default: {
        return this.updateQueryWithConditions(query, key, value);
      }
    }
  }

  private generateWhereQuery<T extends ParseClass>(table: T, where: { [key: string]: unknown }): Parse.Query<T> {
    const keys: Array<string> = Object.keys(where);
    const query = new this.parse.Query(table) as Parse.Query<T>;
    const isCompoundQuery = ['$and', '$or'].some((key: string) => keys.includes(key));
    if (!isCompoundQuery) {
      keys.forEach((key: string) => this.generateKeyValueQuery(table, key, where[key], query));
      return query;
    }
    const queries = keys.map((key: string) => this.generateKeyValueQuery(table, key, where[key]));
    return this.parse.Query.and(...queries) as Parse.Query<T>;
  }
}

export { MongoToParseQueryBase, ParseClass };
