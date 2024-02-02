"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const index_1 = require("../../index");
const test_env_1 = require("../test-env");
describe('MongoToParseQuery', () => {
    describe('function calls', () => {
        context('parseTable', () => {
            it('should return parse table', async () => {
                const mongoToParseQuery = new index_1.MongoToParseQuery();
                await mongoToParseQuery.initialize(test_env_1.Env.appId, test_env_1.Env.serverURL, { disableSingleInstance: true });
                const Table = mongoToParseQuery.parseTable('TableName');
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                (0, chai_1.expect)(new Table() instanceof (mongoToParseQuery.parse).Object).to.be.true;
            });
        });
        context('addParseObjectInfoToJsonObject', async () => {
            const mongoToParseQuery = new index_1.MongoToParseQuery();
            await mongoToParseQuery.initialize(test_env_1.Env.appId, test_env_1.Env.serverURL);
            it('should return undefined', async () => {
                const results = mongoToParseQuery.addParseObjectInfoToJsonObject(undefined, 'TestTable');
                (0, chai_1.expect)(results).to.not.exist;
            });
            it('should return same object when objectId is missing', async () => {
                const result = mongoToParseQuery.addParseObjectInfoToJsonObject({ data: 'dummy' }, 'TestTable');
                (0, chai_1.expect)(result).to.deep.equal({ data: 'dummy' });
            });
            it('should return parse pointer', async () => {
                const result = mongoToParseQuery.addParseObjectInfoToJsonObject({ objectId: '123456' }, 'TestTable');
                (0, chai_1.expect)(result).to.deep.equal({ __type: 'Pointer', className: 'TestTable', objectId: '123456' });
            });
            it('should return parse object', async () => {
                const result = mongoToParseQuery.addParseObjectInfoToJsonObject({ objectId: '123456', data: 'dummy' }, 'TestTable');
                (0, chai_1.expect)(result).to.deep.equal({ __type: 'Object', className: 'TestTable', objectId: '123456', data: 'dummy' });
            });
        });
        context('removeParesObjectDetails', async () => {
            let jsonParseObject;
            const mongoToParseQuery = new index_1.MongoToParseQuery();
            await mongoToParseQuery.initialize(test_env_1.Env.appId, test_env_1.Env.serverURL);
            it('should do nothing when object is not present', async () => {
                jsonParseObject = undefined;
                mongoToParseQuery.removeParesObjectDetails(jsonParseObject);
                (0, chai_1.expect)(jsonParseObject).to.not.exist;
            });
            it('should remove parse object information', async () => {
                jsonParseObject = { __type: 'Object', objectId: '1234', data: 'test', className: 'TestTable' };
                mongoToParseQuery.removeParesObjectDetails(jsonParseObject);
                (0, chai_1.expect)(jsonParseObject).to.deep.equal({ objectId: '1234', data: 'test' });
            });
        });
        context('getPointer', async () => {
            const mongoToParseQuery = new index_1.MongoToParseQuery();
            await mongoToParseQuery.initialize(test_env_1.Env.appId, test_env_1.Env.serverURL);
            const TestTable = mongoToParseQuery.parseTable('TestTable');
            it('should get pointer', async () => {
                const item = new TestTable();
                item.id = 'pointerId';
                item.set('message', '12');
                const pointer = mongoToParseQuery.getPointer(item);
                (0, chai_1.expect)(JSON.parse(JSON.stringify(pointer))).to.deep
                    .equal({ objectId: 'pointerId' });
            });
        });
        context('getPointerFromId', async () => {
            const mongoToParseQuery = new index_1.MongoToParseQuery();
            await mongoToParseQuery.initialize(test_env_1.Env.appId, test_env_1.Env.serverURL);
            const TestTable = mongoToParseQuery.parseTable('TestTable');
            it('should generate pointer from object.', async () => {
                const pointer = mongoToParseQuery.getPointerFromId('testId', TestTable);
                (0, chai_1.expect)(pointer.id).to.equal('testId');
                (0, chai_1.expect)(pointer.get('message')).to.not.exist;
            });
        });
        context('generateWhereQuery', async () => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const mongoToParseQuery = new index_1.MongoToParseQuery();
            await mongoToParseQuery.initialize(test_env_1.Env.appId, test_env_1.Env.serverURL);
            const TestTable = mongoToParseQuery.parseTable('TestTable');
            it('should generate query when not compound query exist.', async () => {
                const query = mongoToParseQuery.generateWhereQuery(TestTable, { a: 1, b: '2', c: [3], d: [4, '5'] });
                (0, chai_1.expect)(JSON.parse(JSON.stringify(query))).to.deep.equal({ where: { a: 1, b: '2', c: 3, d: { $in: [4, '5'] } } });
            });
            it('should generate query when one compound query exist.', async () => {
                const query = mongoToParseQuery.generateWhereQuery(TestTable, { $and: [{ a: 1 }, { b: '2' }], c: [3], d: [4, '5'] });
                (0, chai_1.expect)(JSON.parse(JSON.stringify(query))).to.deep.equal({ where: { $and: [{ a: 1 }, { b: '2' }], c: 3, d: { $in: [4, '5'] } } });
            });
            it('should generate query when two compound query exist.', async () => {
                const query = mongoToParseQuery.generateWhereQuery(TestTable, { $and: [{ a: 1 }, { b: '2' }], $or: [{ c: [3] }], d: [4, '5'] });
                (0, chai_1.expect)(JSON.parse(JSON.stringify(query))).to.deep
                    .equal({ where: { $and: [{ $and: [{ a: 1 }, { b: '2' }] }, { $or: [{ c: 3 }] }], d: { $in: [4, '5'] } } });
            });
            it('should generate query when nested compound query exist.', async () => {
                const query = mongoToParseQuery.generateWhereQuery(TestTable, { $and: [{ a: 1 }, { $or: [{ b: '2' }, { c: [3] }] }], d: [4, '5'] });
                (0, chai_1.expect)(JSON.parse(JSON.stringify(query))).to.deep
                    .equal({ where: { $and: [{ a: 1 }, { $or: [{ b: '2' }, { c: 3 }] }], d: { $in: [4, '5'] } } });
            });
        });
    });
});
//# sourceMappingURL=mongo-to-parse-query-base.node.spec.js.map