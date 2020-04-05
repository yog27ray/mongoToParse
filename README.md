# MongoToParse

MongoToParse transform mongo find query to parse-server find query.

## Getting Started
```
    import { MongoToParseQuery } from 'mongo-to-parse';
    ...
    const mongoToParseQuery = new MongoToParseQuery();
    const result = await new MongoToParseQuery().find(mongoToParseQuery.parseTable('TableName'), { where: { rank: 1 }, option: { useMasterKey: true } } };
```

## Supported mongo operands
1. $and
2. $or
3. $gt
4. $gte
5. $lt
6. $lte
7. $regex
8. $exists
9. $in
10. $eq
10. $nin
10. $ne

## additional operands not present in mongo find query.
1. $endsWith
2. $startsWith

## Example
1.
   ```
   const query = new Parse.Query(TestTable);
   query.equalTo('total', 4);
   await query.find();
   ```
    The above parse query is equivalent to mongo query given below
   ```
    await mongoToParseQuery.find(TestTable, { where: { total: 4 } });
   ```
   
2.
    ```
      const query = new Parse.Query(TestTable);
      query.greatherThan('total', 4);
      query.lessThan('total', 40);
      await query.find();
    ```
     The above parse query is equivalent to mongo query given below
    ```
      await mongoToParseQuery.find(TestTable, { where: { total: { $gt: 4, $lt: 40 } } });
    ```
    
3.
    ```
   const query1 = new Parse.Query(TestTable);
   query1.equalTo('rank', 3);
   const query2 = new Parse.Query(TestTable);
   query2.equalTo('total', 2);
   const query = Parse.Query.and(query1, query2);
   query.ascending('rank');
   await query.find();
   ```
    The above parse query is equivalent to mongo query given below
    ```
    await mongoToParseQuery.find(TestTable, { where: { $and: [{ rank: 3 }, { total: 2 }] }, ascending: 'rank' });
    ``` 
