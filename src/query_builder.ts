import {QueryRequest} from "./types";
import {Query} from "@google-cloud/datastore";

export function queryBuilder(query: Query, req?: QueryRequest): Query {
  if (req) {
    // do something
  }
  return query;
}
