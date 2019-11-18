import {decorate, injectable} from "inversify";
import {METADATA_KEY} from "./constants";

export function repository(entityIdentifier: any) {
  return function (target: any) {
    Reflect.defineMetadata(METADATA_KEY.repository, entityIdentifier, target);
    decorate(injectable(), target);
    return target;
  };
}

export function entity(kind: string) {
  return Reflect.metadata(METADATA_KEY.entity, kind);
}

export function id() {
  return (target: object, propertyKey: string) => {
    Reflect.defineMetadata(METADATA_KEY.entityId, propertyKey, target);
  };
}

export function unindexed() {
  return (target: object, propertyKey: string) => {
    Reflect.defineMetadata(METADATA_KEY.unindexed, propertyKey, target);
  };
}

