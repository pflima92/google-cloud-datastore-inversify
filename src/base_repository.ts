import {inject, injectable} from "inversify";
import {interfaces} from "./interfaces";
import {METADATA_KEY, TYPES} from "./constants";
import {Datastore} from "@google-cloud/datastore";
import {EntityIdentifier, EntityValidationError, Namespaced, QueryRequest} from "./types";
import {Guid} from "guid-typescript";
import {classToPlain, ClassTransformOptions, plainToClass} from "class-transformer";
import {queryBuilder} from "./query_builder";
import {validate} from "class-validator";
import EntityOptions = interfaces.EntityOptions;

@injectable()
export class BaseRepository<T> implements interfaces.CrudRepository<T> {

  protected _db: Datastore;
  private readonly _entityIdentifier: EntityIdentifier<T>;

  constructor(@inject(TYPES.Datastore) datastore: Datastore) {
    this._entityIdentifier = getEntityIdentifier(this.constructor);
    this._db = datastore;
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

    const entities = [];
    for (let e of ts) {
      const entity = await this.mapData(e, ns);
      entities.push(entity);
    }
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

  protected createQuery(queryRequest?: QueryRequest) {
    const kind = this.kind();
    return queryBuilder(this._db.createQuery(kind), queryRequest);
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
    const entityOptions: interfaces.EntityOptions = getEntityOptions(this._entityIdentifier) || {
      excludeExtraneousValues: false
    };

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

    let classTransformOptions: ClassTransformOptions | undefined;
    if (entityOptions && entityOptions.excludeExtraneousValues) {
      classTransformOptions = {excludeExtraneousValues: true};
    }
    const data = classToPlain(concreteClass, classTransformOptions);
    const excludeFromIndexes = getExcludeFromIndexes(concreteClass);

    return {
      key: key,
      data: data,
      excludeFromIndexes: excludeFromIndexes
    };
  }

  protected createKeys(kind: string, keys: any[], ns?: Namespaced) {
    return keys.map(k => this.createKey(kind, k, ns));
  }

  protected kind() {
    return getKind(this._entityIdentifier);
  }
}

function getEntityIdentifier(target: any) {
  const metadata: interfaces.RepositoryMetadata = Reflect.getMetadata(METADATA_KEY.repository, target);
  return metadata.entityIdentifier;
}

function getEntityMetadata(target: any): interfaces.EntityMedata {
  return Reflect.getMetadata(METADATA_KEY.entity, target);
}

function getKind(target: any): string {
  return getEntityMetadata(target).kind;
}

function getEntityOptions(target: any): EntityOptions | undefined {
  return getEntityMetadata(target).entityOptions;
}

function getIdProperty(target: any) {
  return Reflect.getMetadata(METADATA_KEY.entityId, target);
}

function getExcludeFromIndexes(target: any): string[] {
  return Reflect.getMetadata(METADATA_KEY.excludeFromIndexes, target) || [];
}

interface EntityRequest {
  key: any;
  data: any;
  excludeFromIndexes: string[];
}
