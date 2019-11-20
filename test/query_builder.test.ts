import {Filter, Operator, Order, QueryRequest} from "../src";
import {queryBuilder} from "../src/query_builder";
import {Query} from "@google-cloud/datastore";
import {instance, mock, objectContaining, strictEqual, verify} from "ts-mockito";
import {expect} from "chai";

describe("Unit Test: Query Builder", () => {

  it("should build a query from a queryRequest", (done) => {

    let namespace = "myNamespace";
    let myProperty = "myProperty";
    let myValue = "myValue";
    let startToken = "myStartToken";
    let limit = 8000;

    const req = new QueryRequest()
    .withNamespace(namespace)
    .withFilter(Filter.create(myProperty, Operator.EQUAL, myValue))
    .withFilter(Filter.create(myProperty, Operator.GREATER_THAN, myValue))
    .withFilter(Filter.create(myProperty, Operator.GREATER_THAN_OR_EQUAL, myValue))
    .withFilter(Filter.create(myProperty, Operator.LESS_THAN, myValue))
    .withFilter(Filter.create(myProperty, Operator.LESS_THAN_OR_EQUAL, myValue))
    .withFilter(Filter.create(myProperty, Operator.HAS_ANCESTOR, myValue))
    .withStart(startToken)
    .withOrder(Order.create(myProperty, true))
    .withLimit(limit);

    let mockQuery = mock(Query);
    let query = instance(mockQuery);

    query = queryBuilder(query, req);

    expect(query.namespace).eql(namespace);

    verify(mockQuery.start(startToken)).once();
    verify(mockQuery.filter(myProperty, "=", myValue)).once();
    verify(mockQuery.filter(myProperty, "<=", myValue)).once();
    verify(mockQuery.filter(myProperty, "<=", myValue)).once();
    verify(mockQuery.filter(myProperty, ">", myValue)).once();
    verify(mockQuery.filter(myProperty, ">=", myValue)).once();
    verify(mockQuery.filter(myProperty, "HAS_ANCESTOR", myValue)).once();
    verify(mockQuery.limit(limit)).once();
    verify(mockQuery.order(myProperty, objectContaining({descending: true}))).once();
    done();
  });
});
