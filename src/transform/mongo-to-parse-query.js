"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cure_skin_error_1 = require("../error/cure-skin-error");
const parse_1 = require("./parse");
class MongoToParseQuery {
    parseTable(tableName) {
        return parse_1.parse.Object.extend(tableName);
    }
    findAll(table, { select, where, option, descending, ascending, skip, include, limit, }) {
        const query = this.generateWhereQuery(table, where);
        this.updateQuery(query, { select, descending, ascending, skip, include, limit });
        return query.find(option);
    }
    findFirst(table, { select, where, option, descending, ascending, skip, include, limit }) {
        const query = this.generateWhereQuery(table, where);
        this.updateQuery(query, { select, descending, ascending, skip, include, limit });
        return query.first(option);
    }
    async aggregateQuery(table, { pipeline }) {
        const query = new parse_1.parse.Query(table);
        return query.aggregate(pipeline);
    }
    count(table, { where, option, skip, limit }) {
        const query = this.generateWhereQuery(table, where);
        this.updateQuery(query, { skip, limit });
        return query.count(option);
    }
    addParseObjectInfoToJsonObject(jO, className) {
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
    removeParesObjectDetails(object) {
        if (!object) {
            return;
        }
        const parseObject = object;
        delete parseObject.className;
        delete parseObject.__type;
    }
    async saveAll(items, option) {
        await parse_1.parse.Object.saveAll(items, option);
    }
    async fetchObject(item, fieldCheck, option) {
        if (!item) {
            return item;
        }
        if (!item.get(fieldCheck)) {
            await item.fetch(option);
        }
        return item;
    }
    async getObjectsFromPointers(items, fieldCheck, option) {
        const pointers = items.filter((item) => !item.has(fieldCheck));
        if (!pointers.length) {
            return items;
        }
        const Table = this.parseTable(items[0].className);
        const objects = await this.findAll(Table, { where: { objectId: pointers.map((pointer) => pointer.id) }, option });
        return items.map((item) => {
            if (item.get(fieldCheck)) {
                return item;
            }
            return objects.find((object) => ((object.id === item.id) && !!object.get(fieldCheck)));
        })
            .filter((item) => !!item);
    }
    async updatePointersWithObject(items, fieldCheck, option) {
        const pointers = items.filter((item) => !item.has(fieldCheck));
        if (!pointers.length) {
            return;
        }
        await Promise.all(pointers.map((pointer) => pointer.fetch(option)
            .catch((error) => {
            if (error.code === 101 && error.message === 'Object not found.') {
                return Promise.resolve();
            }
            return Promise.reject(error);
        })));
    }
    getPointer(object) {
        const Table = this.parseTable(object.className);
        const pointer = new Table();
        pointer.id = object.id;
        return pointer;
    }
    getPointerFromId(objectId, ParseTable) {
        const pointer = new ParseTable();
        pointer.id = objectId;
        return pointer;
    }
    updateQuery(query, { select, descending, ascending, skip, include, limit }) {
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
            include.forEach((field) => query.include(field));
        }
    }
    updateQueryWithConditions(query, field, value) {
        if (typeof value !== 'object') {
            return this.updateQueryWithConditions(query, field, { $eq: value });
        }
        const valueKeys = Object.keys(value);
        const queryConditionKeys = valueKeys.filter((each) => each.startsWith('$'));
        if (!queryConditionKeys.length) {
            return this.updateQueryWithConditions(query, field, { $eq: value });
        }
        if (queryConditionKeys.length !== valueKeys.length) {
            throw new cure_skin_error_1.CureSkinError({
                code: 400,
                message: `${JSON.stringify(value)} invalid query syntax`,
                type: 'INVALID_QUERY',
            });
        }
        queryConditionKeys.forEach((queryConditionKey) => {
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
                    }
                    else {
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
                    throw new cure_skin_error_1.CureSkinError({
                        code: 400,
                        message: `${queryConditionKey} unhandled query syntax`,
                        type: 'INVALID_QUERY',
                    });
                }
            }
        });
        return query;
    }
    generateKeyValueQuery(table, key, value, query = new parse_1.parse.Query(table)) {
        switch (key) {
            case '$and': {
                const queries = value.map((condition) => this.generateWhereQuery(table, condition));
                return parse_1.parse.Query.and(...queries);
            }
            case '$or': {
                const queries = value.map((condition) => this.generateWhereQuery(table, condition));
                return parse_1.parse.Query.or(...queries);
            }
            default: {
                return this.updateQueryWithConditions(query, key, value);
            }
        }
    }
    generateWhereQuery(table, where) {
        const keys = Object.keys(where);
        const query = new parse_1.parse.Query(table);
        const isCompoundQuery = ['$and', '$or'].some((key) => keys.includes(key));
        if (!isCompoundQuery) {
            keys.forEach((key) => this.generateKeyValueQuery(table, key, where[key], query));
            return query;
        }
        const queries = keys.map((key) => this.generateKeyValueQuery(table, key, where[key]));
        return parse_1.parse.Query.and(...queries);
    }
}
exports.MongoToParseQuery = MongoToParseQuery;
//# sourceMappingURL=mongo-to-parse-query.js.map