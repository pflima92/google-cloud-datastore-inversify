import {inject, injectable} from "inversify";
import {interfaces} from "./interfaces";
import {METADATA_KEY, TYPE} from "./constants";
import {Datastore} from "@google-cloud/datastore";
import {EntityIdentifier, Namespaced, QueryRequest, EntityValidationError} from "./types";
import {Guid} from "guid-typescript";
import {classToPlain, plainToClass} from "class-transformer";
import {queryBuilder} from "./query_builder";
import {validate} from "class-validator";

@injectable()
export class BaseRepository<T> implements interfaces.Repository<T> {

  private readonly _entityIdentifier: EntityIdentifier<T>;
  private _db: Datastore;

  constructor(@inject(TYPE.Datastore) db: Datastore) {
    this._entityIdentifier = getEntityIdentifier(this.constructor);
    this._db = db;
  }

  public async exists(id: any, ns?: Namespaced): Promise<boolean>;
  public async exists(queryRequest?: QueryRequest): Promise<boolean>;
  public async exists(idOrQueryRequest?: any | QueryRequest, ns?: Namespaced): Promise<boolean> {

    if (idOrQueryRequest instanceof QueryRequest) {
      const query = this.createQuery(idOrQueryRequest);
      const [results] = await this._db.runQuery(query);
      return Promise.resolve(results.length > 0);
    }

    const kind = this.kind();
    const key = this.createKey(kind, idOrQueryRequest, ns);
    const [result] = await this._db.get(key);
    return !!result;
  }

  public async findAll(queryRequest?: QueryRequest): Promise<T[]> {

    const query = this.createQuery(queryRequest);
    const [results] = await this._db.runQuery(query);
    return Promise.resolve(plainToClass(this._entityIdentifier, results));
  }

  public async findAllById(ids: any[], ns?: Namespaced): Promise<T[]> {

    if (!ids) {
      return Promise.resolve([]);
    }

    const kind = this.kind();
    const keys = this.createKeys(kind, ids, ns);
    const [results] = await this._db.get(keys);
    return Promise.resolve(results);
  }

  public async findById(id: any, ns?: Namespaced): Promise<T> {

    const kind = this.kind();
    const keys = this.createKey(kind, id, ns);
    const [result] = await this._db.get(keys);
    return Promise.resolve(result);
  }

  public async save(t: T, ns?: Namespaced): Promise<T> {

    const entity = await this.mapData(t, ns);
    await this._db.save(entity);
    return Promise.resolve(t);
  }

  public async saveAll(ts: T[], ns?: Namespaced): Promise<T[]> {

    const entities = ts.map(async t => await this.mapData(t, ns));
    await this._db.save(entities);
    return Promise.resolve(ts);
  }

  public async remove(t: T, ns?: Namespaced): Promise<boolean>;
  public async remove(id: any, ns?: Namespaced): Promise<boolean>;
  public async remove(t: T | any, ns?: Namespaced): Promise<boolean> {

    const kind = this.kind();
    const key = this.createKey(kind, t, ns);
    await this._db.delete(key);
    return Promise.resolve(true);
  }

  public async removeAll(entities: T[], ns?: Namespaced): Promise<boolean>;
  public async removeAll(ids: any[], ns?: Namespaced): Promise<boolean>;
  public async removeAll(entitiesOrIds: T[] | any, ns?: Namespaced): Promise<boolean> {

    const kind = this.kind();
    const keys = this.createKeys(kind, entitiesOrIds, ns);
    await this._db.delete(keys);
    return Promise.resolve(true);
  }

  protected createKey(kind: string, key: any, ns?: Namespaced) {
    if (key instanceof this._entityIdentifier) {
      const idProperty = getIdProperty(key);
      key = key[idProperty];
    }

    return this._db.key({
      ...ns,
      path: [kind, key]
    });
  }

  protected async mapData(t: T, ns?: Namespaced): Promise<EntityRequest> {
    const kind = this.kind();

    let keyValue: Object;

    const idProperty = getIdProperty(t);
    if (idProperty) {
      keyValue = t[idProperty];
    } else if ((t as any).id) {
      keyValue = (t as any).id;
    } else {
      keyValue = Guid.create();
    }

    const concreteClass: T = plainToClass(this._entityIdentifier, t);

    const validationErrors = await validate(concreteClass);
    if (validationErrors && validationErrors.length > 0) {
      throw new EntityValidationError(validationErrors);
    }

    const key = this.createKey(kind, keyValue, ns);

    const entity = {
      key: key,
      data: classToPlain(concreteClass),
    };
    return entity;
  }

  protected createKeys(kind: string, keys: any[], ns?: Namespaced) {
    return keys.map(k => this.createKey(kind, k, ns));
  }

  protected createQuery(queryRequest?: QueryRequest) {
    const kind = this.kind();
    return queryBuilder(this._db.createQuery(kind), queryRequest);
  }

  protected kind() {
    return getKind(this._entityIdentifier);
  }
}

function getEntityIdentifier(target: any) {
  const metadata: interfaces.RepositoryMetadata = Reflect.getMetadata(METADATA_KEY.repository, target);
  return metadata.entityIdentifier;
}

function getKind(target: any) {
  return Reflect.getMetadata(METADATA_KEY.entity, target);
}

function getIdProperty(target: any) {
  return Reflect.getMetadata(METADATA_KEY.entityId, target);
}

interface EntityRequest {
  key: any;
  data: any;
}
