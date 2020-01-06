import {EntityIdentifier, Namespaced, PagedResponse, QueryRequest} from "./types";

namespace interfaces {

  export interface RepositoryMetadata {
    target: any;
    entityIdentifier: EntityIdentifier<any>;
  }

  export interface EntityMedata {
    kind: string;
    entityOptions?: EntityOptions;
  }

  export interface EntityOptions {
    excludeExtraneousValues?: false | true;
    excludeLargeProperties?: false | true;
  }

  export interface CrudRepository<T> {

    /**
     * Count all occurrences of entities of the given domain type.
     * @param ns the optional namespace for this operation.
     */
    count(ns?: Namespaced): Promise<number>;

    /**
     * Check if the given ID belongs to an entity in Cloud Datastore.
     * @param id the id of the entity.
     * @param ns the optional namespace for this operation.
     */
    exists(id: any, ns?: Namespaced): Promise<boolean>;

    /**
     * Check if the given queryRequest returns any result in Cloud Datastore.
     * @param queryRequest
     */
    exists(queryRequest?: QueryRequest): Promise<boolean>;

    /**
     * Get an entity based on a id.
     * @param id the id of the entity.
     * @param ns the optional namespace for this operation.
     */
    findById(id: any, ns?: Namespaced): Promise<T>;

    /**
     * Finds objects by using a Cloud Datastore query.
     * @param queryRequest
     */
    findAll(queryRequest?: QueryRequest): Promise<T[]>;

    /**
     *
     * @param ids
     * @param ns the optional namespace for this operation.
     */
    findAllById(ids: any[], ns?: Namespaced): Promise<T[]>;

    /**
     * Saves an instance of an object to Cloud Datastore.
     * @param t nstance the instance to save.
     * @param ns the optional namespace for this operation.
     */
    save(t: T, ns?: Namespaced): Promise<T>;

    /**
     * Saves multiple instances of objects to Cloud Datastore.
     * @param ts entities the objects to save.
     * @param ns
     */
    saveAll(ts: T[], ns?: Namespaced): Promise<T[]>;

    /**
     *  Delete an entity from Cloud Datastore.
     * @param t
     * @param ns the optional namespace for this operation.
     */
    remove(t: T, ns?: Namespaced): Promise<boolean>;

    /**
     * Delete an entity from Cloud Datastore.
     * @param id the id of the entity.
     * @param ns the optional namespace for this operation.
     */
    remove(id: any, ns?: Namespaced): Promise<boolean>;

    /**
     * Delete multiple entities from Cloud Datastore.
     * @param t
     * @param ns the optional namespace for this operation.
     */
    removeAll(t: T[], ns?: Namespaced): Promise<boolean>;

    /**
     * Delete multiple IDs from Cloud Datastore.
     * @param id the id of the entity.
     * @param ns the optional namespace for this operation.
     */
    removeAll(id: any[], ns?: Namespaced): Promise<boolean>;
  }

  export interface PagedCrudRepository<T> extends CrudRepository<T> {

    /**
     * Finds objects by using a Cloud Datastore query.
     * @param queryRequest
     * @return
     */
    findAllPaged(queryRequest?: QueryRequest): Promise<PagedResponse<T>>;

  }
}

export {interfaces};
