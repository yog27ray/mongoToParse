import { injectable } from 'inversify';
// tslint:disable-next-line:no-import-side-effect
import 'reflect-metadata';
import { CureSkinError } from '../error/cure-skin-error';
import { parse as Parse } from './parse';

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
  option?: { useMasterKey?: boolean; sessionToken?: string };
  pipeline: Array<any>;
}

declare interface UpdateQueryDataType {
  select?: Array<string>;
  limit: number;
  descending?: any;
  ascending?: any;
  skip: number;
  include?: Array<string>;
}

@injectable()
class MongoToParseQuery {
  parseTable(tableName: string): new () => Parse.Object {
    return Parse.Object.extend(tableName);
  }

  find(table: new () => Parse.Object, {
    select, where, option, descending, ascending, skip, include, limit,
  }: QueryDataType): Promise<Array<Parse.Object>> {
    const query = this.generateWhereQuery(table, where);
    this.updateQuery(query, { select, descending, ascending, skip, include, limit });
    return query.find(option);
  }

  findOne(table: new () => Parse.Object, { select, where, option, descending, ascending, skip, include, limit }:
    QueryDataType): Promise<Parse.Object> {
    const query = this.generateWhereQuery(table, where);
    this.updateQuery(query, { select, descending, ascending, skip, include, limit });
    return query.first(option);
  }

  aggregate(table: new () => Parse.Object, { pipeline }: AggregateDataType): Promise<any> {
    const query = new Parse.Query(table);
    return query.aggregate(pipeline);
  }

  count(table: new () => Parse.Object, { where, option, skip, limit }: CountDataType): Promise<any> {
    const query = this.generateWhereQuery(table, where);
    this.updateQuery(query, { skip, limit });
    return query.count(option);
  }

  addParseObjectInfoToJsonObject(jO: any, className: string): any {
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

  removeParesObjectDetails(object: any): void {
    if (!object) {
      return;
    }
    const parseObject = object;
    delete parseObject.className;
    delete parseObject.__type;
  }

  async saveAll(items: any, option: Parse.FullOptions): Promise<any> {
    await Parse.Object.saveAll(items, option);
  }

  async fetchObject(item: Parse.Object, fieldCheck: string, option: Parse.FullOptions): Promise<Parse.Object> {
    if (!item) {
      return item;
    }
    if (!item.get(fieldCheck)) {
      await item.fetch(option);
    }
    return item;
  }

  async getObjectsFromPointers(items: Array<Parse.Object>, fieldCheck: string, option: Parse.FullOptions): Promise<Array<Parse.Object>> {
    const pointers = items.filter((item: any) => !item.has(fieldCheck));
    if (!pointers.length) {
      return items;
    }
    const Table = this.parseTable(items[0].className);
    const objects = await this.find(Table, { where: { objectId: pointers.map((pointer: any) => pointer.id) }, option });
    return items.map((item: any) => {
      if (item.get(fieldCheck)) {
        return item;
      }
      return objects.find((object: any) => ((object.id === item.id) && !!object.get(fieldCheck)));
    })
      .filter((item: any) => !!item);
  }

  async updatePointersWithObject(items: Array<Parse.Object>, fieldCheck: string, option: Parse.FullOptions): Promise<void> {
    const pointers = items.filter((item: any) => !item.has(fieldCheck));
    if (!pointers.length) {
      return;
    }
    await Promise.all(pointers.map((pointer: Parse.Object) => pointer.fetch(option)
      .catch((error: any) => {
        if (error.code === 101 && error.message === 'Object not found.') {
          return Promise.resolve();
        }
        return Promise.reject(error);
      })));
  }

  getPointer(object: Parse.Object): Parse.Object {
    const Table = this.parseTable(object.className);
    const pointer = new Table();
    pointer.id = object.id;
    return pointer;
  }

  getPointerFromId(objectId: string, ParseTable: new () => Parse.Object): Parse.Object {
    const pointer = new ParseTable();
    pointer.id = objectId;
    return pointer;
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

  private updateQueryWithConditions(query: Parse.Query, field: string, value: any): Parse.Query {
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
          query.matches(field, value[queryConditionKey], value.$options);
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

  private generateKeyValueQuery(table: new () => Parse.Object, key: string, value: any, query: any = new Parse.Query(table)): any {
    switch (key) {
      case '$and': {
        const queries = value.map((condition: object) => this.generateWhereQuery(table, condition));
        return Parse.Query.and(...queries);
      }
      case '$or': {
        const queries = value.map((condition: object) => this.generateWhereQuery(table, condition));
        return Parse.Query.or(...queries);
      }
      default: {
        return this.updateQueryWithConditions(query, key, value);
      }
    }
  }

  private generateWhereQuery(table: new () => Parse.Object, where: object): Parse.Query {
    const keys: Array<string> = Object.keys(where);
    const query = new Parse.Query(table);
    const isCompoundQuery = ['$and', '$or'].some((key: string) => keys.includes(key));
    if (!isCompoundQuery) {
      keys.forEach((key: string) => this.generateKeyValueQuery(table, key, where[key], query));
      return query;
    }
    const queries = keys.map((key: string) => this.generateKeyValueQuery(table, key, where[key]));
    return Parse.Query.and(...queries);
  }
}

export { MongoToParseQuery };
