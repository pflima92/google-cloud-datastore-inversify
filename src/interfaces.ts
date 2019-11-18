import {EntityIdentifier, Namespaced, QueryRequest} from "./types";

namespace interfaces {

  export interface RepositoryMetadata {
    target: any;
    entityIdentifier: EntityIdentifier<any>;
  }

  export interface Repository<T> {
    save(t: T, ns?: Namespaced): Promise<T>;

    findAll(queryRequest?: QueryRequest): Promise<T[]>;
  }

  export interface NamespaceResolver {
    resolve(): string;
  }
}

export {interfaces};
