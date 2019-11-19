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

  public static namedQuery(query: string, args: any[]) {
    return new QueryRequest();
  }

  public static create() {
    return new QueryRequest();
  }
}

export class Filter {
  public static KEY = "__key__";
}

export const Operator = {
  EQUAL: "=",
  NOT_EQUAL: "!=",
  LESS_THAN: "<",
  LESS_THAN_OR_EQUAL: "<=",
  GREATER_THAN: ">",
  GREATER_THAN_OR_EQUAL: ">="
};

export class Order {
  public field: string;
  public descending: boolean;

  public static create(field: string, descending: boolean) {
    return new Order(field, descending);
  }

  constructor(field: string, descending: boolean) {
    this.field = field;
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
