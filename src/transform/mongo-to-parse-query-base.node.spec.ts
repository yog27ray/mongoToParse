import { expect } from 'chai';
import { MongoToParseQuery } from '../../index';
import { Env } from '../test-env';
import { ParseObjectExtender } from './parse-object-extender';

declare type DummyRowClass = ParseObjectExtender<{
  time: Date;
  rank: number;
  tags: Array<string>;
  message: string;
  total: number;
  field: number;
  item: Parse.Object;
}>;

describe('MongoToParseQuery', () => {
  describe('function calls', () => {
    context('parseTable', () => {
      it('should return parse table', async () => {
        const mongoToParseQuery: MongoToParseQuery = new MongoToParseQuery();
        await mongoToParseQuery.initialize(Env.appId, Env.serverURL, { disableSingleInstance: true });
        const Table = mongoToParseQuery.parseTable('TableName');
        expect(new Table() instanceof ((mongoToParseQuery as unknown as { parse: any }).parse).Object).to.be.true;
      });
    });

    context('addParseObjectInfoToJsonObject', async () => {
      const mongoToParseQuery: MongoToParseQuery = new MongoToParseQuery();
      await mongoToParseQuery.initialize(Env.appId, Env.serverURL);

      it('should return undefined', async () => {
        const results = mongoToParseQuery.addParseObjectInfoToJsonObject(undefined, 'TestTable');
        expect(results).to.not.exist;
      });

      it('should return same object when objectId is missing', async () => {
        const result = mongoToParseQuery.addParseObjectInfoToJsonObject({ data: 'dummy' }, 'TestTable');
        expect(result).to.deep.equal({ data: 'dummy' });
      });

      it('should return parse pointer', async () => {
        const result = mongoToParseQuery.addParseObjectInfoToJsonObject({ objectId: '123456' }, 'TestTable');
        expect(result).to.deep.equal({ __type: 'Pointer', className: 'TestTable', objectId: '123456' });
      });

      it('should return parse object', async () => {
        const result = mongoToParseQuery.addParseObjectInfoToJsonObject({ objectId: '123456', data: 'dummy' }, 'TestTable');
        expect(result).to.deep.equal({ __type: 'Object', className: 'TestTable', objectId: '123456', data: 'dummy' });
      });
    });

    context('removeParesObjectDetails', async () => {
      let jsonParseObject: { [key: string]: unknown; };
      const mongoToParseQuery: MongoToParseQuery = new MongoToParseQuery();
      await mongoToParseQuery.initialize(Env.appId, Env.serverURL);

      it('should do nothing when object is not present', async () => {
        jsonParseObject = undefined;
        mongoToParseQuery.removeParesObjectDetails(jsonParseObject);
        expect(jsonParseObject).to.not.exist;
      });

      it('should remove parse object information', async () => {
        jsonParseObject = { __type: 'Object', objectId: '1234', data: 'test', className: 'TestTable' };
        mongoToParseQuery.removeParesObjectDetails(jsonParseObject);
        expect(jsonParseObject).to.deep.equal({ objectId: '1234', data: 'test' });
      });
    });

    context('getPointer', async () => {
      const mongoToParseQuery: MongoToParseQuery = new MongoToParseQuery();
      await mongoToParseQuery.initialize(Env.appId, Env.serverURL);
      const TestTable: new () => DummyRowClass = mongoToParseQuery.parseTable('TestTable');

      it('should get pointer', async () => {
        const item = new TestTable();
        item.id = 'pointerId';
        item.set('message', '12');
        const pointer = mongoToParseQuery.getPointer(item);
        expect(JSON.parse(JSON.stringify(pointer))).to.deep
          .equal({ objectId: 'pointerId' });
      });
    });

    context('getPointerFromId', async () => {
      const mongoToParseQuery: MongoToParseQuery = new MongoToParseQuery();
      await mongoToParseQuery.initialize(Env.appId, Env.serverURL);
      const TestTable: new () => DummyRowClass = mongoToParseQuery.parseTable('TestTable');

      it('should generate pointer from object.', async () => {
        const pointer = mongoToParseQuery.getPointerFromId('testId', TestTable);
        expect(pointer.id).to.equal('testId');
        expect(pointer.get('message')).to.not.exist;
      });
    });

    context('generateWhereQuery', async () => {
      const mongoToParseQuery: any = new MongoToParseQuery();
      await mongoToParseQuery.initialize(Env.appId, Env.serverURL);
      const TestTable: new () => DummyRowClass = mongoToParseQuery.parseTable('TestTable');

      it('should generate query when not compound query exist.', async () => {
        const query = mongoToParseQuery.generateWhereQuery(TestTable, { a: 1, b: '2', c: [3], d: [4, '5'] });
        expect(JSON.parse(JSON.stringify(query))).to.deep.equal({ where: { a: 1, b: '2', c: 3, d: { $in: [4, '5'] } } });
      });

      it('should generate query when one compound query exist.', async () => {
        const query = mongoToParseQuery.generateWhereQuery(TestTable, { $and: [{ a: 1 }, { b: '2' }], c: [3], d: [4, '5'] });
        expect(JSON.parse(JSON.stringify(query))).to.deep.equal({ where: { $and: [{ a: 1 }, { b: '2' }], c: 3, d: { $in: [4, '5'] } } });
      });

      it('should generate query when two compound query exist.', async () => {
        const query = mongoToParseQuery.generateWhereQuery(TestTable, { $and: [{ a: 1 }, { b: '2' }], $or: [{ c: [3] }], d: [4, '5'] });
        expect(JSON.parse(JSON.stringify(query))).to.deep
          .equal({ where: { $and: [{ $and: [{ a: 1 }, { b: '2' }] }, { $or: [{ c: 3 }] }], d: { $in: [4, '5'] } } });
      });

      it('should generate query when nested compound query exist.', async () => {
        const query = mongoToParseQuery.generateWhereQuery(TestTable, { $and: [{ a: 1 }, { $or: [{ b: '2' }, { c: [3] }] }], d: [4, '5'] });
        expect(JSON.parse(JSON.stringify(query))).to.deep
          .equal({ where: { $and: [{ a: 1 }, { $or: [{ b: '2' }, { c: 3 }] }], d: { $in: [4, '5'] } } });
      });
    });
  });
});
