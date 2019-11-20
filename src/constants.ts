const TYPES = {
  Datastore: Symbol.for("Datastore")
};

const METADATA_KEY = {
  repository: "_repository",
  entity: "_entity",
  entityId: "_entity-id",
  excludeFromIndexes: "_excludeFromIndexes",
};

const CONTRAINTS = {
  id: new RegExp("__.*__")
};

export {TYPES, METADATA_KEY, CONTRAINTS};
