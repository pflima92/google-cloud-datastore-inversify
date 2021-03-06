import {ValidationError} from "class-validator";

export type EntityIdentifier<T> = any;

export class Namespaced {
  public namespace: string | undefined;

  constructor(namespace?: string) {
    this.namespace = namespace;
  }
}

export class QueryRequest extends Namespaced {
  public limit?: number;
  public start?: string;
  public filter: Filter[] = [];
  public order?: Order;
  public select?: string | string[] = [];

  public static create() {
    return new QueryRequest();
  }

  public withNamespace(namespace: string): QueryRequest {
    this.namespace = namespace;
    return this;
  }

  public withLimit(limit: number): QueryRequest {
    this.limit = limit;
    return this;
  }

  public withStart(start: string): QueryRequest {
    this.start = start;
    return this;
  }

  public withFilter(filter: Filter): QueryRequest {
    this.filter.push(filter);
    return this;
  }

  public withOrder(order: Order): QueryRequest {
    this.order = order;
    return this;
  }

  public withSelection(select: string | string[]) {
    this.select = select;
    return this;
  }
}

export class Filter {

  public static KEY = "__key__";

  public property: string;
  public operator: Operator;
  public value: string;

  public static create(property: string, operator: Operator, value: any): Filter {
    return new Filter(property, operator, value);
  }

  constructor(property: string, operator: Operator, value: string) {
    this.property = property;
    this.operator = operator;
    this.value = value;
  }
}

export enum Operator {
  EQUAL = "=",
  LESS_THAN = "<",
  LESS_THAN_OR_EQUAL = "<=",
  GREATER_THAN = ">",
  GREATER_THAN_OR_EQUAL = ">=",
  HAS_ANCESTOR = "HAS_ANCESTOR"
}

export class Order {
  public property: string;
  public descending: boolean;

  public static create(property: string, descending: boolean) {
    return new Order(property, descending);
  }

  constructor(property: string, descending: boolean) {
    this.property = property;
    this.descending = descending;
  }
}

export class EntityValidationError extends Error {

  public errors: ValidationError[];

  constructor(errors: ValidationError[]) {
    super("Validation failed");
    this.errors = errors;
  }
}

export class PagedResponse<T> {
  public data: T[];
  public endCursor?: string;
  public moreResults?: "MORE_RESULTS_TYPE_UNSPECIFIED" | "NOT_FINISHED" | "MORE_RESULTS_AFTER_LIMIT" | "MORE_RESULTS_AFTER_CURSOR" | "NO_MORE_RESULTS";
}
