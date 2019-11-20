const TYPES = {
  Datastore: Symbol.for("Datastore")
};

const METADATA_KEY = {
  repository: "_repository",
  entity: "_entity",
  entityId: "_entity-id",
  unindexed: "_unindexed",
};

const CONTRAINTS = {
  id: new RegExp("__.*__")
};

export {TYPES, METADATA_KEY, CONTRAINTS};
