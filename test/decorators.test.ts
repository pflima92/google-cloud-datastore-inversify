import {expect} from "chai";
import {entity, id, interfaces, repository, unindexed} from "../src";
import {METADATA_KEY} from "../src/constants";

describe("Unit Test: Repository Decorators", () => {

  it("should add repository metadata to a class when decorated with @repository", (done) => {

    @entity("MyEntityKind")
    class MyEntity {
    }

    @repository(MyEntity)
    class TestRepository {
    }

    let repositoryMetadata: interfaces.RepositoryMetadata = Reflect.getMetadata(
        METADATA_KEY.repository,
        TestRepository
    );

    expect(repositoryMetadata.target).eql(TestRepository);
    expect(repositoryMetadata.entityIdentifier).eql(MyEntity);
    done();
  });
});

describe("Unit Test: Entity Decorators", () => {

  it("should add repository metadata to a class when decorated with @entity", (done) => {

    @entity("MyEntityKind")
    class MyEntity {
      @id()
      public entityId: string;
      @unindexed()
      public unindexedField1: string;
      @unindexed()
      public unindexedField2: number[];
    }

    let kind: string = Reflect.getMetadata(
        METADATA_KEY.entity,
        MyEntity
    );

    let entityId: string = Reflect.getMetadata(
        METADATA_KEY.entityId,
        new MyEntity()
    );

    let unindexedFields: string[] = Reflect.getMetadata(
        METADATA_KEY.unindexed,
        new MyEntity()
    );

    expect(kind).eql("MyEntityKind");
    expect(entityId).eql("entityId");
    expect(unindexedFields).contains("unindexedField1");
    expect(unindexedFields).contains("unindexedField2");
    done();
  });
});
