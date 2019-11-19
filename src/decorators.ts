import {decorate, injectable} from "inversify";
import {CONTRAINTS, METADATA_KEY} from "./constants";
import {interfaces} from "./interfaces";
import {registerDecorator, ValidationArguments, ValidationOptions} from "class-validator";

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

export function entity(kind: string) {
  return Reflect.metadata(METADATA_KEY.entity, kind);
}

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
