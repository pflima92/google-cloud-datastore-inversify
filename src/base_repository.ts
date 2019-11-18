import {inject, injectable} from "inversify";
import {interfaces} from "./interfaces";
import {METADATA_KEY, TYPE} from "./constants";
import {Datastore} from "@google-cloud/datastore";
import {EntityIdentifier, Namespaced, QueryRequest} from "./types";
import {Guid} from "guid-typescript";
import {classToPlain} from "class-transformer";
import {queryBuilder} from "./query_builder";

@injectable()
export abstract class BaseRepository<T> implements interfaces.Repository<T> {

  private readonly _entityIdentifier: EntityIdentifier<T>;
  private _db: Datastore;

  protected constructor(@inject(TYPE.Datastore) db: Datastore) {
    this._entityIdentifier = getEntityIdentifier(this.constructor);
    this._db = db;
  }

  public async save(t: T, ns?: Namespaced): Promise<T> {

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

    const key = this.createKey(kind, keyValue, ns);

    const entity = {
      key: key,
      data: classToPlain(t),
    };

    await this._db.save(entity);

    return Promise.resolve(t);
  }

  public async findAll(queryRequest?: QueryRequest): Promise<T[]> {

    const query = this.createQuery(queryRequest);
    const [results] = await this._db.runQuery(query);
    // TODO cast properly
    return Promise.resolve(results.map(x => x as T));
  }

  protected createKey(kind: string, key: any, ns?: Namespaced) {
    return this._db.key({
      ...ns,
      path: [kind, key]
    });
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

