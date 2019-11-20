import {decorate, injectable} from "inversify";
import {CONTRAINTS, METADATA_KEY} from "./constants";
import {interfaces} from "./interfaces";
import {registerDecorator, ValidationOptions} from "class-validator";
import EntityOptions = interfaces.EntityOptions;

/**
 * Decorates a Google Datastore Repository
 * @param entityIdentifier the entity assinged for that repository
 */
export function repository(entityIdentifier: any) {
  return function (target: any) {
    const metadata: interfaces.RepositoryMetadata = {
      target: target,
      entityIdentifier: entityIdentifier
    };
    Reflect.defineMetadata(METADATA_KEY.repository, metadata, target);
    decorate(injectable(), target);
    return target;
  };
}

/**
 * Decorates an entity.
 * @param kind the kind name of an entity.
 * @param entityOptions the options for serialization
 */
export function entity(kind: string, entityOptions?: EntityOptions) {
  const metadata: interfaces.EntityMedata = {
    kind: kind,
    entityOptions: entityOptions
  };
  return Reflect.metadata(METADATA_KEY.entity, metadata);
}

/**
 * Identify the path to compose an entity key.
 * @param validationOptions optional for customize the field validation
 */
export function id(validationOptions?: ValidationOptions) {
  return (target: object, propertyKey: string) => {
    Reflect.defineMetadata(METADATA_KEY.entityId, propertyKey, target);

    registerDecorator({
      name: "isValidId",
      target: target.constructor,
      propertyName: propertyKey,
      options: validationOptions,
      validator: {
        validate(value: any) {
          return value && value.length > 0 && !CONTRAINTS.id.test(value);
        }
      }
    });
  };
}

/**
 * The field decorated will be excluded from entity indexes.
 */
export function excludeFromIndex() {
  return (target: object, propertyKey: string) => {
    let excludeFromIndexes = Reflect.getMetadata(METADATA_KEY.excludeFromIndexes, target) || [];
    excludeFromIndexes.push(propertyKey);
    Reflect.defineMetadata(METADATA_KEY.excludeFromIndexes, excludeFromIndexes, target);
  };
}
