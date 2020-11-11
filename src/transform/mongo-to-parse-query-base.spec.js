"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const server_1 = require("../../server");
const setup_1 = require("../setup");
function parseObjectJSON(results) {
    return results.map((each) => {
        const resultJSON = each.toJSON();
        delete resultJSON.updatedAt;
        delete resultJSON.createdAt;
        delete resultJSON.objectId;
        if (resultJSON.item) {
            delete resultJSON.item.objectId;
            delete resultJSON.item.createdAt;
            delete resultJSON.item.updatedAt;
        }
        return resultJSON;
    });
}
async function createDummyRows(TestTable, mongoToParseQuery) {
    await setup_1.dropDB();
    await mongoToParseQuery.saveAll([
        { time: new Date(0), rank: 1, message: 'this is message 1', total: 1, field: 1 },
        { time: new Date(10), rank: 2, message: 'startsWith this regex is message 2', total: 2 },
        { time: new Date(20), rank: 3, message: 'this is message 3 endsWith', total: 2 },
        { time: new Date(30), rank: 4, message: 'this is message 4', total: 3, field: 2 },
        { time: new Date(40), rank: 5, message: 'this is regex message 5', total: 3 },
        { time: new Date(50), rank: 6, message: 'this is message 6', total: 3 },
        { time: new Date(60), rank: 7, message: 'startsWith this is regex message 7 endsWith', total: 4, field: 3 },
        { time: new Date(70), rank: 8, message: 'this is message 8', total: 4 },
        { time: new Date(80), rank: 9, message: 'startsWith this is message 9', total: 4 },
        { time: new Date(90), rank: 10, message: 'this is message 10 endsWith', total: 4 },
    ].map((each) => {
        const tempObject = new TestTable();
        Object.keys(each).forEach((key) => tempObject.set(key, each[key]));
        return tempObject;
    }), {});
    const TestTable2 = mongoToParseQuery.parseTable('TestTable2');
    const item = new TestTable2();
    item.set('name', 'xyz');
    const result = await mongoToParseQuery.findOne(TestTable, { where: { rank: 10 }, ascending: 'rank' });
    await result.save({ item });
}
describe('MongoToParseQuery', () => {
    describe('function calls', () => {
        context('parseTable', () => {
            it('should return parse table', async () => {
                const Table = new server_1.MongoToParseQuery().parseTable('TableName');
                chai_1.expect(new Table() instanceof Parse.Object).to.be.true;
            });
        });
        context('findOne', () => {
            const mongoToParseQuery = new server_1.MongoToParseQuery();
            const TestTable = mongoToParseQuery.parseTable('TestTable');
            before(async () => {
                await createDummyRows(TestTable, mongoToParseQuery);
            });
            it('should fetch first result with total 4', async () => {
                const result = await mongoToParseQuery.findOne(TestTable, { where: { total: 4 }, descending: 'rank' });
                const [resultJSON] = parseObjectJSON([result]);
                chai_1.expect(resultJSON).to.deep.equal({
                    time: { __type: 'Date', iso: '1970-01-01T00:00:00.090Z' },
                    rank: 10,
                    message: 'this is message 10 endsWith',
                    total: 4,
                    item: { __type: 'Pointer', className: 'TestTable2' },
                });
            });
        });
        context('find', () => {
            const mongoToParseQuery = new server_1.MongoToParseQuery();
            const TestTable = mongoToParseQuery.parseTable('TestTable');
            before(async () => {
                await createDummyRows(TestTable, mongoToParseQuery);
            });
            it('should fetch all results', async () => {
                const results = await mongoToParseQuery.find(TestTable, { where: {} });
                chai_1.expect(results.length).to.equal(10);
            });
        });
        context('count', () => {
            const mongoToParseQuery = new server_1.MongoToParseQuery();
            const TestTable = mongoToParseQuery.parseTable('TestTable');
            before(async () => {
                await createDummyRows(TestTable, mongoToParseQuery);
            });
            it('should return count to row having total 3', async () => {
                const results = await mongoToParseQuery.count(TestTable, { where: { total: 3 } });
                chai_1.expect(results).to.equal(3);
            });
        });
        context('addParseObjectInfoToJsonObject', () => {
            const mongoToParseQuery = new server_1.MongoToParseQuery();
            it('should return undefined', async () => {
                const results = mongoToParseQuery.addParseObjectInfoToJsonObject(undefined, 'TestTable');
                chai_1.expect(results).to.not.exist;
            });
            it('should return same object when objectId is missing', async () => {
                const result = mongoToParseQuery.addParseObjectInfoToJsonObject({ data: 'dummy' }, 'TestTable');
                chai_1.expect(result).to.deep.equal({ data: 'dummy' });
            });
            it('should return parse pointer', async () => {
                const result = mongoToParseQuery.addParseObjectInfoToJsonObject({ objectId: '123456' }, 'TestTable');
                chai_1.expect(result).to.deep.equal({ __type: 'Pointer', className: 'TestTable', objectId: '123456' });
            });
            it('should return parse object', async () => {
                const result = mongoToParseQuery.addParseObjectInfoToJsonObject({ objectId: '123456', data: 'dummy' }, 'TestTable');
                chai_1.expect(result).to.deep.equal({ __type: 'Object', className: 'TestTable', objectId: '123456', data: 'dummy' });
            });
        });
        context('removeParesObjectDetails', () => {
            let jsonParseObject;
            const mongoToParseQuery = new server_1.MongoToParseQuery();
            it('should do nothing when object is not present', async () => {
                jsonParseObject = undefined;
                mongoToParseQuery.removeParesObjectDetails(jsonParseObject);
                chai_1.expect(jsonParseObject).to.not.exist;
            });
            it('should remove parse object information', async () => {
                jsonParseObject = { __type: 'Object', objectId: '1234', data: 'test', className: 'TestTable' };
                mongoToParseQuery.removeParesObjectDetails(jsonParseObject);
                chai_1.expect(jsonParseObject).to.deep.equal({ objectId: '1234', data: 'test' });
            });
        });
        context('fetchObject', () => {
            let parseObject;
            const mongoToParseQuery = new server_1.MongoToParseQuery();
            const TestTable = mongoToParseQuery.parseTable('TestTable');
            before(async () => {
                await createDummyRows(TestTable, mongoToParseQuery);
                parseObject = await mongoToParseQuery.findOne(TestTable, { where: { rank: 1 } });
            });
            it('should do nothing when object is not present', async () => {
                const result = await mongoToParseQuery.fetchObject(undefined, 'total', {});
                chai_1.expect(result).to.not.exist;
            });
            it('should not fetch object if field value is already present', async () => {
                let pointer = new TestTable();
                pointer.id = parseObject.id;
                pointer.set('total', 2);
                pointer = await mongoToParseQuery.fetchObject(pointer, 'total', {});
                const [pointerJSON] = parseObjectJSON([pointer]);
                chai_1.expect(pointerJSON).to.deep.equal({ total: 2 });
            });
            it('should fetch object if field value is not present', async () => {
                let pointer = new TestTable();
                pointer.id = parseObject.id;
                pointer = await mongoToParseQuery.fetchObject(pointer, 'total', {});
                chai_1.expect(pointer.toJSON()).to.deep.equal(parseObject.toJSON());
            });
        });
        context('getObjectsFromPointers', () => {
            let rows;
            const mongoToParseQuery = new server_1.MongoToParseQuery();
            const TestTable = mongoToParseQuery.parseTable('TestTable');
            before(async () => {
                await createDummyRows(TestTable, mongoToParseQuery);
                rows = await mongoToParseQuery.find(TestTable, { where: {} });
            });
            it('should do nothing when there is not pointer object', async () => {
                const results = await mongoToParseQuery.getObjectsFromPointers(rows, 'total', {});
                chai_1.expect(results.map((each) => each.toJSON())).to.deep.equal(rows.map((each) => each.toJSON()));
            });
            it('should fetch pointers when there are pointer object', async () => {
                const invalidPointer = new TestTable();
                invalidPointer.id = 'invalidPointer';
                const pointers = [].concat(rows[0], rows[1])
                    .concat(invalidPointer)
                    .concat(...[rows[2], rows[3]].map((each) => {
                    const pointer = new TestTable();
                    pointer.id = each.id;
                    return pointer;
                }));
                const results = await mongoToParseQuery.getObjectsFromPointers(pointers, 'total', {});
                chai_1.expect(results.length).to.equal(4);
                chai_1.expect(results.map((each) => each.toJSON())).to.deep
                    .equal([rows[0], rows[1], rows[2], rows[3]].map((each) => each.toJSON()));
            });
        });
        context('updatePointersWithObject', () => {
            let rows;
            const mongoToParseQuery = new server_1.MongoToParseQuery();
            const TestTable = mongoToParseQuery.parseTable('TestTable');
            before(async () => {
                await createDummyRows(TestTable, mongoToParseQuery);
                rows = await mongoToParseQuery.find(TestTable, { where: {} });
            });
            it('should do nothing when there is not pointer object', async () => {
                const pointers = rows.map((each) => each);
                await mongoToParseQuery.updatePointersWithObject(rows, 'total', {});
                chai_1.expect(pointers.map((each) => each.toJSON())).to.deep.equal(rows.map((each) => each.toJSON()));
            });
            it('should fetch pointers when there are pointer object', async () => {
                const invalidPointer = new TestTable();
                invalidPointer.id = 'invalidPointer';
                const pointers = [].concat(rows[0], rows[1])
                    .concat(invalidPointer)
                    .concat(...[rows[2], rows[3]].map((each) => {
                    const pointer = new TestTable();
                    pointer.id = each.id;
                    return pointer;
                }));
                await mongoToParseQuery.updatePointersWithObject(pointers, 'total', {});
                chai_1.expect(pointers.length).to.equal(5);
                chai_1.expect(pointers.map((each) => each.toJSON())).to.deep
                    .equal([rows[0], rows[1], invalidPointer, rows[2], rows[3]].map((each) => each.toJSON()));
            });
            it('should 1 fetch pointers when there are pointer object', async () => {
                try {
                    const invalidPointer = new TestTable();
                    const pointers = [].concat(rows[0], rows[1])
                        .concat(invalidPointer)
                        .concat(...[rows[2], rows[3]].map((each) => {
                        const pointer = new TestTable();
                        pointer.id = each.id;
                        return pointer;
                    }));
                    await mongoToParseQuery.updatePointersWithObject(pointers, 'total', {});
                    await Promise.reject({ code: 99, message: 'should not reach here.' });
                }
                catch (error) {
                    chai_1.expect({ code: error.code, message: error.message }).to.deep
                        .equal({ code: 104, message: 'Object does not have an ID' });
                }
            });
        });
        context('aggregate', () => {
            const mongoToParseQuery = new server_1.MongoToParseQuery();
            const TestTable = mongoToParseQuery.parseTable('TestTable');
            before(async () => {
                await createDummyRows(TestTable, mongoToParseQuery);
            });
            it('should fetch result of aggregate', async () => {
                const results = await mongoToParseQuery.aggregate(TestTable, {
                    pipeline: [{ match: { total: 4 } }, { project: { total: 1, rank: 1, objectId: 0 } }, { sort: { rank: -1 } }],
                });
                chai_1.expect(results).to.deep.equal([
                    { rank: 10, total: 4 },
                    { rank: 9, total: 4 },
                    { rank: 8, total: 4 },
                    { rank: 7, total: 4 },
                ]);
            });
        });
        context('getPointer', () => {
            const mongoToParseQuery = new server_1.MongoToParseQuery();
            const TestTable = mongoToParseQuery.parseTable('TestTable');
            it('should get pointer', async () => {
                const item = new TestTable();
                item.id = 'pointerId';
                item.set('item', '12');
                const pointer = mongoToParseQuery.getPointer(item);
                chai_1.expect(JSON.parse(JSON.stringify(pointer))).to.deep
                    .equal({ objectId: 'pointerId' });
            });
        });
        context('Cloud.run', () => {
            const mongoToParseQuery = new server_1.MongoToParseQuery();
            it('should get error when function name is not present.', async () => {
                try {
                    await mongoToParseQuery.Cloud.run('testCloudRun');
                    await Promise.reject({ code: 99, message: 'Should not reach here' });
                }
                catch (error) {
                    const { code, message } = error;
                    chai_1.expect({ code, message }).to.deep.equal({
                        code: 141,
                        message: 'Invalid function: "testCloudRun"',
                    });
                }
            });
            it('should successfully call cloud function validFunctionName.', async () => {
                const response = await mongoToParseQuery.Cloud.run('validFunctionName');
                chai_1.expect(response).to.deep.equal({});
            });
        });
        context('getPointerFromId', () => {
            const mongoToParseQuery = new server_1.MongoToParseQuery();
            const TestTable = mongoToParseQuery.parseTable('TestTable');
            it('should generate pointer from object.', async () => {
                const pointer = mongoToParseQuery.getPointerFromId('testId', TestTable);
                chai_1.expect(pointer.id).to.equal('testId');
                chai_1.expect(pointer.get('name')).to.not.exist;
            });
        });
    });
    describe('query conditions', () => {
        const mongoToParseQuery = new server_1.MongoToParseQuery();
        const TestTable = mongoToParseQuery.parseTable('TestTable');
        before(async () => {
            await createDummyRows(TestTable, mongoToParseQuery);
        });
        it('should give error when invalid syntax is provided', async () => {
            try {
                await mongoToParseQuery.find(TestTable, { where: { total: { $in: [1], of: 2 } } });
                await Promise.reject({ code: 99, message: 'Should not reach here.' });
            }
            catch (error) {
                chai_1.expect(error.toJSON()).to.deep.equal({
                    code: 400,
                    type: 'INVALID_QUERY',
                    message: '{"$in":[1],"of":2} invalid query syntax',
                });
            }
        });
        it('should give error when invalid field is provided', async () => {
            try {
                await mongoToParseQuery.find(TestTable, { where: { $total: { $in: [1] } } });
                await Promise.reject({ code: 99, message: 'Should not reach here.' });
            }
            catch (error) {
                chai_1.expect(error.toJSON()).to.deep.equal({
                    code: 400,
                    type: 'INVALID_QUERY',
                    message: 'field "$total" is invalid syntax',
                });
            }
        });
        it('should give error when unhandled condition is provided', async () => {
            try {
                await mongoToParseQuery.find(TestTable, { where: { total: { $int: [1] } } });
                await Promise.reject({ code: 99, message: 'Should not reach here.' });
            }
            catch (error) {
                chai_1.expect(error.toJSON()).to.deep.equal({
                    code: 400,
                    type: 'INVALID_QUERY',
                    message: '$int unhandled query syntax',
                });
            }
        });
        it('should return row where message endsWith "endsWith"', async () => {
            const results = await mongoToParseQuery.find(TestTable, { where: { message: { $endsWith: 'endsWith' } }, ascending: 'rank' });
            const resultsJSON = parseObjectJSON(results);
            chai_1.expect(resultsJSON).to.deep.equal([{
                    time: { __type: 'Date', iso: '1970-01-01T00:00:00.020Z' },
                    rank: 3,
                    message: 'this is message 3 endsWith',
                    total: 2,
                }, {
                    time: { __type: 'Date', iso: '1970-01-01T00:00:00.060Z' },
                    rank: 7,
                    message: 'startsWith this is regex message 7 endsWith',
                    total: 4,
                    field: 3,
                }, {
                    time: { __type: 'Date', iso: '1970-01-01T00:00:00.090Z' },
                    rank: 10,
                    message: 'this is message 10 endsWith',
                    total: 4,
                    item: { __type: 'Pointer', className: 'TestTable2' },
                }]);
        });
        it('should return row where message startsWith "startsWith"', async () => {
            const results = await mongoToParseQuery.find(TestTable, { where: { message: { $startsWith: 'startsWith' } }, ascending: 'rank' });
            const resultsJSON = parseObjectJSON(results);
            chai_1.expect(resultsJSON).to.deep.equal([{
                    time: { __type: 'Date', iso: '1970-01-01T00:00:00.010Z' },
                    rank: 2,
                    message: 'startsWith this regex is message 2',
                    total: 2,
                }, {
                    time: { __type: 'Date', iso: '1970-01-01T00:00:00.060Z' },
                    rank: 7,
                    message: 'startsWith this is regex message 7 endsWith',
                    total: 4,
                    field: 3,
                }, {
                    time: { __type: 'Date', iso: '1970-01-01T00:00:00.080Z' },
                    rank: 9,
                    message: 'startsWith this is message 9',
                    total: 4,
                }]);
        });
        it('should return row where message regex "regex"', async () => {
            const results = await mongoToParseQuery
                .find(TestTable, { where: { message: { $regex: 'regex', $options: 'i' } }, ascending: 'rank' });
            const resultsJSON = parseObjectJSON(results);
            chai_1.expect(resultsJSON).to.deep.equal([{
                    time: { __type: 'Date', iso: '1970-01-01T00:00:00.010Z' },
                    rank: 2,
                    message: 'startsWith this regex is message 2',
                    total: 2,
                }, {
                    time: { __type: 'Date', iso: '1970-01-01T00:00:00.040Z' },
                    rank: 5,
                    message: 'this is regex message 5',
                    total: 3,
                }, {
                    time: { __type: 'Date', iso: '1970-01-01T00:00:00.060Z' },
                    rank: 7,
                    message: 'startsWith this is regex message 7 endsWith',
                    total: 4,
                    field: 3,
                }]);
        });
        it('should return row where rank greater than "7"', async () => {
            const results = await mongoToParseQuery.find(TestTable, { where: { rank: { $gt: 7 } }, ascending: 'rank' });
            const resultsJSON = parseObjectJSON(results);
            chai_1.expect(resultsJSON).to.deep.equal([{
                    time: { __type: 'Date', iso: '1970-01-01T00:00:00.070Z' },
                    rank: 8,
                    message: 'this is message 8',
                    total: 4,
                }, {
                    time: { __type: 'Date', iso: '1970-01-01T00:00:00.080Z' },
                    rank: 9,
                    message: 'startsWith this is message 9',
                    total: 4,
                }, {
                    time: { __type: 'Date', iso: '1970-01-01T00:00:00.090Z' },
                    rank: 10,
                    message: 'this is message 10 endsWith',
                    total: 4,
                    item: { __type: 'Pointer', className: 'TestTable2' },
                }]);
        });
        it('should return row where rank greater than equal to "7"', async () => {
            const results = await mongoToParseQuery.find(TestTable, { where: { rank: { $gte: 7 } }, ascending: 'rank' });
            const resultsJSON = parseObjectJSON(results);
            chai_1.expect(resultsJSON).to.deep.equal([{
                    time: { __type: 'Date', iso: '1970-01-01T00:00:00.060Z' },
                    rank: 7,
                    message: 'startsWith this is regex message 7 endsWith',
                    total: 4,
                    field: 3,
                }, {
                    time: { __type: 'Date', iso: '1970-01-01T00:00:00.070Z' },
                    rank: 8,
                    message: 'this is message 8',
                    total: 4,
                }, {
                    time: { __type: 'Date', iso: '1970-01-01T00:00:00.080Z' },
                    rank: 9,
                    message: 'startsWith this is message 9',
                    total: 4,
                }, {
                    time: { __type: 'Date', iso: '1970-01-01T00:00:00.090Z' },
                    rank: 10,
                    message: 'this is message 10 endsWith',
                    total: 4,
                    item: { __type: 'Pointer', className: 'TestTable2' },
                }]);
        });
        it('should return row where rank less than "3"', async () => {
            const results = await mongoToParseQuery.find(TestTable, { where: { rank: { $lt: 3 } }, ascending: 'rank' });
            const resultsJSON = parseObjectJSON(results);
            chai_1.expect(resultsJSON).to.deep.equal([{
                    time: { __type: 'Date', iso: '1970-01-01T00:00:00.000Z' },
                    rank: 1,
                    message: 'this is message 1',
                    total: 1,
                    field: 1,
                }, {
                    time: { __type: 'Date', iso: '1970-01-01T00:00:00.010Z' },
                    rank: 2,
                    message: 'startsWith this regex is message 2',
                    total: 2,
                }]);
        });
        it('should return row where rank less than equal to "3"', async () => {
            const results = await mongoToParseQuery.find(TestTable, { where: { rank: { $lte: 3 } }, ascending: 'rank' });
            const resultsJSON = parseObjectJSON(results);
            chai_1.expect(resultsJSON).to.deep.equal([{
                    time: { __type: 'Date', iso: '1970-01-01T00:00:00.000Z' },
                    rank: 1,
                    message: 'this is message 1',
                    total: 1,
                    field: 1,
                }, {
                    time: { __type: 'Date', iso: '1970-01-01T00:00:00.010Z' },
                    rank: 2,
                    message: 'startsWith this regex is message 2',
                    total: 2,
                }, {
                    time: { __type: 'Date', iso: '1970-01-01T00:00:00.020Z' },
                    rank: 3,
                    message: 'this is message 3 endsWith',
                    total: 2,
                }]);
        });
        it('should return row where field exists "true"', async () => {
            const results = await mongoToParseQuery.find(TestTable, { where: { field: { $exists: true } }, ascending: 'rank' });
            const resultsJSON = parseObjectJSON(results);
            chai_1.expect(resultsJSON).to.deep.equal([{
                    time: { __type: 'Date', iso: '1970-01-01T00:00:00.000Z' },
                    rank: 1,
                    message: 'this is message 1',
                    total: 1,
                    field: 1,
                }, {
                    time: { __type: 'Date', iso: '1970-01-01T00:00:00.030Z' },
                    rank: 4,
                    message: 'this is message 4',
                    total: 3,
                    field: 2,
                }, {
                    time: { __type: 'Date', iso: '1970-01-01T00:00:00.060Z' },
                    rank: 7,
                    message: 'startsWith this is regex message 7 endsWith',
                    total: 4,
                    field: 3,
                }]);
        });
        it('should return row where field exists "false"', async () => {
            const results = await mongoToParseQuery.find(TestTable, { where: { field: { $exists: false } }, ascending: 'rank' });
            const resultsJSON = parseObjectJSON(results);
            chai_1.expect(resultsJSON).to.deep.equal([{
                    time: { __type: 'Date', iso: '1970-01-01T00:00:00.010Z' },
                    rank: 2,
                    message: 'startsWith this regex is message 2',
                    total: 2,
                }, {
                    time: { __type: 'Date', iso: '1970-01-01T00:00:00.020Z' },
                    rank: 3,
                    message: 'this is message 3 endsWith',
                    total: 2,
                }, {
                    time: { __type: 'Date', iso: '1970-01-01T00:00:00.040Z' },
                    rank: 5,
                    message: 'this is regex message 5',
                    total: 3,
                }, {
                    time: { __type: 'Date', iso: '1970-01-01T00:00:00.050Z' },
                    rank: 6,
                    message: 'this is message 6',
                    total: 3,
                }, {
                    time: { __type: 'Date', iso: '1970-01-01T00:00:00.070Z' },
                    rank: 8,
                    message: 'this is message 8',
                    total: 4,
                }, {
                    time: { __type: 'Date', iso: '1970-01-01T00:00:00.080Z' },
                    rank: 9,
                    message: 'startsWith this is message 9',
                    total: 4,
                }, {
                    time: { __type: 'Date', iso: '1970-01-01T00:00:00.090Z' },
                    rank: 10,
                    message: 'this is message 10 endsWith',
                    total: 4,
                    item: { __type: 'Pointer', className: 'TestTable2' },
                }]);
        });
        it('should return row where rank not in [1]', async () => {
            const results = await mongoToParseQuery.find(TestTable, { where: { rank: { $nin: [1] } }, ascending: 'rank' });
            const resultsJSON = parseObjectJSON(results);
            chai_1.expect(resultsJSON).to.deep.equal([{
                    time: { __type: 'Date', iso: '1970-01-01T00:00:00.010Z' },
                    rank: 2,
                    message: 'startsWith this regex is message 2',
                    total: 2,
                }, {
                    time: { __type: 'Date', iso: '1970-01-01T00:00:00.020Z' },
                    rank: 3,
                    message: 'this is message 3 endsWith',
                    total: 2,
                }, {
                    time: { __type: 'Date', iso: '1970-01-01T00:00:00.030Z' },
                    rank: 4,
                    message: 'this is message 4',
                    total: 3,
                    field: 2,
                }, {
                    time: { __type: 'Date', iso: '1970-01-01T00:00:00.040Z' },
                    rank: 5,
                    message: 'this is regex message 5',
                    total: 3,
                }, {
                    time: { __type: 'Date', iso: '1970-01-01T00:00:00.050Z' },
                    rank: 6,
                    message: 'this is message 6',
                    total: 3,
                }, {
                    time: { __type: 'Date', iso: '1970-01-01T00:00:00.060Z' },
                    rank: 7,
                    message: 'startsWith this is regex message 7 endsWith',
                    total: 4,
                    field: 3,
                }, {
                    time: { __type: 'Date', iso: '1970-01-01T00:00:00.070Z' },
                    rank: 8,
                    message: 'this is message 8',
                    total: 4,
                }, {
                    time: { __type: 'Date', iso: '1970-01-01T00:00:00.080Z' },
                    rank: 9,
                    message: 'startsWith this is message 9',
                    total: 4,
                }, {
                    time: { __type: 'Date', iso: '1970-01-01T00:00:00.090Z' },
                    rank: 10,
                    message: 'this is message 10 endsWith',
                    total: 4,
                    item: { __type: 'Pointer', className: 'TestTable2' },
                }]);
        });
        it('should return row where rank is not 1', async () => {
            const results = await mongoToParseQuery.find(TestTable, { where: { rank: { $ne: 1 } }, ascending: 'rank' });
            const resultsJSON = parseObjectJSON(results);
            chai_1.expect(resultsJSON).to.deep.equal([{
                    time: { __type: 'Date', iso: '1970-01-01T00:00:00.010Z' },
                    rank: 2,
                    message: 'startsWith this regex is message 2',
                    total: 2,
                }, {
                    time: { __type: 'Date', iso: '1970-01-01T00:00:00.020Z' },
                    rank: 3,
                    message: 'this is message 3 endsWith',
                    total: 2,
                }, {
                    time: { __type: 'Date', iso: '1970-01-01T00:00:00.030Z' },
                    rank: 4,
                    message: 'this is message 4',
                    total: 3,
                    field: 2,
                }, {
                    time: { __type: 'Date', iso: '1970-01-01T00:00:00.040Z' },
                    rank: 5,
                    message: 'this is regex message 5',
                    total: 3,
                }, {
                    time: { __type: 'Date', iso: '1970-01-01T00:00:00.050Z' },
                    rank: 6,
                    message: 'this is message 6',
                    total: 3,
                }, {
                    time: { __type: 'Date', iso: '1970-01-01T00:00:00.060Z' },
                    rank: 7,
                    message: 'startsWith this is regex message 7 endsWith',
                    total: 4,
                    field: 3,
                }, {
                    time: { __type: 'Date', iso: '1970-01-01T00:00:00.070Z' },
                    rank: 8,
                    message: 'this is message 8',
                    total: 4,
                }, {
                    time: { __type: 'Date', iso: '1970-01-01T00:00:00.080Z' },
                    rank: 9,
                    message: 'startsWith this is message 9',
                    total: 4,
                }, {
                    time: { __type: 'Date', iso: '1970-01-01T00:00:00.090Z' },
                    rank: 10,
                    message: 'this is message 10 endsWith',
                    total: 4,
                    item: { __type: 'Pointer', className: 'TestTable2' },
                }]);
        });
        it('should return row where rank is not in [1, 2, 3]', async () => {
            const results = await mongoToParseQuery.find(TestTable, { where: { rank: { $nin: [1, 2, 3] } }, ascending: 'rank' });
            const resultsJSON = parseObjectJSON(results);
            chai_1.expect(resultsJSON).to.deep.equal([{
                    time: { __type: 'Date', iso: '1970-01-01T00:00:00.030Z' },
                    rank: 4,
                    message: 'this is message 4',
                    total: 3,
                    field: 2,
                }, {
                    time: { __type: 'Date', iso: '1970-01-01T00:00:00.040Z' },
                    rank: 5,
                    message: 'this is regex message 5',
                    total: 3,
                }, {
                    time: { __type: 'Date', iso: '1970-01-01T00:00:00.050Z' },
                    rank: 6,
                    message: 'this is message 6',
                    total: 3,
                }, {
                    time: { __type: 'Date', iso: '1970-01-01T00:00:00.060Z' },
                    rank: 7,
                    message: 'startsWith this is regex message 7 endsWith',
                    total: 4,
                    field: 3,
                }, {
                    time: { __type: 'Date', iso: '1970-01-01T00:00:00.070Z' },
                    rank: 8,
                    message: 'this is message 8',
                    total: 4,
                }, {
                    time: { __type: 'Date', iso: '1970-01-01T00:00:00.080Z' },
                    rank: 9,
                    message: 'startsWith this is message 9',
                    total: 4,
                }, {
                    time: { __type: 'Date', iso: '1970-01-01T00:00:00.090Z' },
                    rank: 10,
                    message: 'this is message 10 endsWith',
                    total: 4,
                    item: { __type: 'Pointer', className: 'TestTable2' },
                }]);
        });
        it('should return row where rank in [1]', async () => {
            const results = await mongoToParseQuery.find(TestTable, { where: { rank: [1] }, ascending: 'rank' });
            const resultsJSON = parseObjectJSON(results);
            chai_1.expect(resultsJSON).to.deep.equal([{
                    time: { __type: 'Date', iso: '1970-01-01T00:00:00.000Z' },
                    rank: 1,
                    message: 'this is message 1',
                    total: 1,
                    field: 1,
                }]);
        });
        it('should return row where rank is 1', async () => {
            const results = await mongoToParseQuery.find(TestTable, { where: { rank: 1 }, ascending: 'rank' });
            const resultsJSON = parseObjectJSON(results);
            chai_1.expect(resultsJSON).to.deep.equal([{
                    time: { __type: 'Date', iso: '1970-01-01T00:00:00.000Z' },
                    rank: 1,
                    message: 'this is message 1',
                    total: 1,
                    field: 1,
                }]);
        });
        it('should return row where rank is in [1, 2, 3]', async () => {
            const results = await mongoToParseQuery.find(TestTable, { where: { rank: [1, 2, 3] }, ascending: 'rank' });
            const resultsJSON = parseObjectJSON(results);
            chai_1.expect(resultsJSON).to.deep.equal([{
                    time: { __type: 'Date', iso: '1970-01-01T00:00:00.000Z' },
                    rank: 1,
                    message: 'this is message 1',
                    total: 1,
                    field: 1,
                }, {
                    time: { __type: 'Date', iso: '1970-01-01T00:00:00.010Z' },
                    rank: 2,
                    message: 'startsWith this regex is message 2',
                    total: 2,
                }, {
                    time: { __type: 'Date', iso: '1970-01-01T00:00:00.020Z' },
                    rank: 3,
                    message: 'this is message 3 endsWith',
                    total: 2,
                }]);
        });
        it('should return row where rank is in [1, 2, 3] by skip 1 and limit 1', async () => {
            const results = await mongoToParseQuery.find(TestTable, { where: { rank: [1, 2, 3] }, ascending: 'rank', skip: 1, limit: 1 });
            const resultsJSON = parseObjectJSON(results);
            chai_1.expect(resultsJSON).to.deep.equal([{
                    time: { __type: 'Date', iso: '1970-01-01T00:00:00.010Z' },
                    rank: 2,
                    message: 'startsWith this regex is message 2',
                    total: 2,
                }]);
        });
        it('should return row where rank is in [1, 2, 3] by skip 1 and limit 1 and select message', async () => {
            const results = await mongoToParseQuery
                .find(TestTable, { where: { rank: [1, 2, 3] }, ascending: 'rank', skip: 1, limit: 1, select: ['message'] });
            const resultsJSON = parseObjectJSON(results);
            chai_1.expect(resultsJSON).to.deep.equal([{ message: 'startsWith this regex is message 2' }]);
        });
        it('should return row where rank is 3 or total is 2', async () => {
            const results = await mongoToParseQuery.find(TestTable, { where: { $or: [{ rank: 3 }, { total: 2 }] }, ascending: 'rank' });
            const resultsJSON = parseObjectJSON(results);
            chai_1.expect(resultsJSON).to.deep.equal([{
                    time: { __type: 'Date', iso: '1970-01-01T00:00:00.010Z' },
                    rank: 2,
                    message: 'startsWith this regex is message 2',
                    total: 2,
                }, {
                    time: { __type: 'Date', iso: '1970-01-01T00:00:00.020Z' },
                    rank: 3,
                    message: 'this is message 3 endsWith',
                    total: 2,
                }]);
        });
        it('should return row where rank is 3 and total is 2', async () => {
            const results = await mongoToParseQuery.find(TestTable, { where: { $and: [{ rank: 3 }, { total: 2 }] }, ascending: 'rank' });
            const resultsJSON = parseObjectJSON(results);
            chai_1.expect(resultsJSON).to.deep.equal([{
                    time: { __type: 'Date', iso: '1970-01-01T00:00:00.020Z' },
                    rank: 3,
                    message: 'this is message 3 endsWith',
                    total: 2,
                }]);
        });
        it('should include row with inner pointer', async () => {
            const result = await mongoToParseQuery.findOne(TestTable, { where: { rank: 10 }, ascending: 'rank', include: ['item'] });
            const [resultJSON] = parseObjectJSON([result]);
            chai_1.expect(resultJSON).to.deep.equal({
                time: { __type: 'Date', iso: '1970-01-01T00:00:00.090Z' },
                rank: 10,
                message: 'this is message 10 endsWith',
                total: 4,
                item: { name: 'xyz', __type: 'Object', className: 'TestTable2' },
            });
        });
    });
});
//# sourceMappingURL=mongo-to-parse-query-base.spec.js.map