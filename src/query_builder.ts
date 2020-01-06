import {Query} from "@google-cloud/datastore";
import {QueryRequest} from "./types";

export function queryBuilder(query: Query, req?: QueryRequest): Query {

  if (req) {

    if (req.namespace) {
      query.namespace = req.namespace;
    }

    if (req.order) {
      query.order(req.order.property, {
        descending: req.order.descending,
      });
    }

    if (req.filter && req.filter.forEach) {
      req.filter.forEach(f => {
        query.filter(f.property, f.operator as any, f.value);
      });
    }

    if (req.start) {
      query.start(req.start);
    }

    if (req.limit && req.limit > 0) {
      query.limit(req.limit);
    }

    if (req.select) {
      query.select(req.select);
    }
  }
  return query;
}
