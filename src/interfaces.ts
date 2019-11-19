import {EntityIdentifier, Namespaced, QueryRequest} from "./types";

namespace interfaces {

  export interface RepositoryMetadata {
    target: any;
    entityIdentifier: EntityIdentifier<any>;
  }

  export interface Repository<T> {

    exists(id: any, ns?: Namespaced): Promise<boolean>;

    exists(queryRequest?: QueryRequest): Promise<boolean>;

    findById(id: any, ns?: Namespaced): Promise<T>;

    findAll(queryRequest?: QueryRequest): Promise<T[]>;

    findAllById(ids: any[], ns?: Namespaced): Promise<T[]>;

    save(t: T, ns?: Namespaced): Promise<T>;

    saveAll(ts: T[], ns?: Namespaced): Promise<T[]>;

    remove(t: T, ns?: Namespaced): Promise<boolean>;

    remove(id: any, ns?: Namespaced): Promise<boolean>;

    removeAll(t: T[], ns?: Namespaced): Promise<boolean>;

    removeAll(id: any[], ns?: Namespaced): Promise<boolean>;
  }
}

export {interfaces};
