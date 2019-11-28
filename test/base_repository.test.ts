import {expect} from "chai";

import {BaseRepository, entity, excludeFromIndex, id, repository, TYPES} from "../src";
import {Container} from "inversify";
import {Datastore} from "@google-cloud/datastore";
import {anything, capture, instance, mock, verify, when} from "ts-mockito";
import {IsEmail} from "class-validator";
import {Expose} from "class-transformer";

describe("Unit Test: BaseRepository", () => {

  let container: Container;
  const mockDb = mock(Datastore);

  beforeEach("setup", function (done) {
    container = new Container();
    const mockDbInstance = instance(mockDb);
    container.bind(TYPES.Datastore).toConstantValue(mockDbInstance);
    done();
  });

  it("should save an entity when called", (done) => {

    @entity("MyEntityKind")
    class MyEntity {
      @id()
      public entityId: string;
      @excludeFromIndex()
      public unindexedProperty: string;
    }

    @repository(MyEntity)
    class TestRepository extends BaseRepository<MyEntity> {
    }

    // Setup Container
    container.bind<TestRepository>(TestRepository).toSelf();
    const fixture = container.get<TestRepository>(TestRepository);

    // Give Parameters
    const t = new MyEntity();
    t.entityId = "foo";
    t.unindexedProperty = "bar";

    let mockKey = {};

    // @ts-ignore
    when(mockDb.key(anything())).thenReturn(mockKey);
    when(mockDb.save(anything())).thenResolve();

    // Then
    fixture.save(t).then(result => {

      const [saveRequest] = capture(mockDb.save).last();
      verify(mockDb.save(anything())).once();

      expect(result).eql(t);
      expect(saveRequest.key).eql(mockKey);
      expect(saveRequest.data).eql(t);
      expect(saveRequest.excludeFromIndexes).contains("unindexedProperty");

      done();
    });
  });

  it("should save an entity and excludeExtraneousValues when decorated", (done) => {

    @entity("MyEntityKind", {excludeExtraneousValues: true})
    class MyEntityIgnoringValidation {
      @id()
      @Expose()
      public entityId: string;
      public transientField: string;
    }

    @repository(MyEntityIgnoringValidation)
    class TestRepositoryIgnoringValidation extends BaseRepository<MyEntityIgnoringValidation> {
    }

    // Setup Container
    container.bind<TestRepositoryIgnoringValidation>(TestRepositoryIgnoringValidation).toSelf();
    const fixture = container.get<TestRepositoryIgnoringValidation>(TestRepositoryIgnoringValidation);

    // Give Parameters
    const t = new MyEntityIgnoringValidation();
    t.entityId = "some_id";
    t.transientField = "some_value";

    // @ts-ignore
    when(mockDb.save(anything())).thenResolve();

    // Then
    fixture.save(t).then(result => {
      const [saveRequest] = capture(mockDb.save).last();
      expect(saveRequest.data.entityId).eql("some_id");
      expect(saveRequest.data.transientField).eql(undefined);
      done();
    });
  });

  it("should save an entity and excludeLargeProperties when decorated", (done) => {

    @entity("MyEntityKind", {excludeLargeProperties: true})
    class MyEntityWithExcludeLargeProperties {
      @id()
      public entityId: string;
    }

    @repository(MyEntityWithExcludeLargeProperties)
    class TestRepositoryWithExcludeLargeProperties extends BaseRepository<MyEntityWithExcludeLargeProperties> {
    }

    // Setup Container
    container.bind<TestRepositoryWithExcludeLargeProperties>(TestRepositoryWithExcludeLargeProperties).toSelf();
    const fixture = container.get<TestRepositoryWithExcludeLargeProperties>(TestRepositoryWithExcludeLargeProperties);

    // Give Parameters
    const t = new MyEntityWithExcludeLargeProperties();
    t.entityId = "some_id";

    // @ts-ignore
    when(mockDb.save(anything())).thenResolve();

    // Then
    fixture.save(t).then(result => {
      const [saveRequest] = capture(mockDb.save).last();
      expect(saveRequest.data.entityId).eql("some_id");
      expect(saveRequest.excludeLargeProperties).eql(true);
      done();
    });
  });

  it("should validate an entity annotated with validators and fail if it is not valid", async () => {

    @entity("MyEntityKind")
    class MyEntity {
      @id()
      public entityId: string;

      @IsEmail()
      public mail: string;
    }

    @repository(MyEntity)
    class TestRepository extends BaseRepository<MyEntity> {
    }

    // Setup Container
    container.bind<TestRepository>(TestRepository).toSelf();
    const fixture = container.get<TestRepository>(TestRepository);

    // Give Parameters
    const t = new MyEntity();
    t.entityId = "foo";

    // Then
    try {
      await fixture.save(t);
      throw new Error("was not supposed to succeed");
    } catch (e) {
      expect(e.errors.length).to.equal(1);
      expect(e.errors[0].property).to.equal("mail");
    }
  });

  it("should return an valid query response", async () => {

    @entity("MyEntityKind")
    class MyEntity {
      @id()
      public entityId: string;

      public toString(): string {
        return `entityId=[${this.entityId}]`;
      }
    }

    @repository(MyEntity)
    class TestRepository extends BaseRepository<MyEntity> {
    }

    // Setup Container
    container.bind<TestRepository>(TestRepository).toSelf();
    const fixture = container.get<TestRepository>(TestRepository);

    let expResponse = [[
      {entityId: "1", nonMappedValue: ""}
    ], {}];

    // @ts-ignore
    when(mockDb.runQuery(anything())).thenResolve(expResponse);

    const results = await fixture.findAll();
    expect(results.length).eql(1);
    expect(results[0].entityId).eql("1");
    expect(results[0].toString()).eql("entityId=[1]");
  });
});
