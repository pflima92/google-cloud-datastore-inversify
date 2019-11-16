import { decorate, injectable } from "inversify";
import { METADATA_KEY } from "./constants";

export function repository(entityIdentifier: any) {
    return function (target: any) {
        Reflect.defineMetadata(METADATA_KEY.repository, entityIdentifier, target);
        decorate(injectable(), target);
        return target;
    };
}
