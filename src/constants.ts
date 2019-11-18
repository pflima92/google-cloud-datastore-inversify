const TYPE = {
    Datastore: Symbol.for("Datastore"),
    Repository: Symbol.for("Repository"),
    Entity: Symbol.for("Entity")
};

const METADATA_KEY = {
    repository: "_repository",
    entity: "_entity",
    entityId: "_entity-id",
    unindexed: "_unindexed",
};

export { TYPE, METADATA_KEY };
