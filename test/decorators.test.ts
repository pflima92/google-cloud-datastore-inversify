import {expect} from "chai";
import {entity, excludeFromIndex, id, interfaces, repository} from "../src";
import {METADATA_KEY} from "../src/constants";

describe("Unit Test: Decorators", () => {

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

  it("should add repository metadata to a class when decorated with @entity", (done) => {

    @entity("MyEntityKind", {excludeExtraneousValues: true})
    class MyEntity {
      @id()
      public entityId: string;
    }

    let metadata: interfaces.EntityMedata = Reflect.getMetadata(
        METADATA_KEY.entity,
        MyEntity
    );

    let kind: string = metadata.kind;
    let entityOptions = metadata.entityOptions;

    let entityId: string = Reflect.getMetadata(
        METADATA_KEY.entityId,
        new MyEntity()
    );

    expect(kind).eql("MyEntityKind");
    expect(entityOptions
        && entityOptions.excludeExtraneousValues).eql(true);
    expect(entityId).eql("entityId");
    done();
  });

  it("should add excludeFromIndexes metadata to a class when properties was decorated with @excludeFromIndex", (done) => {

    @entity("MyEntityKind")
    class MyEntity {
      @id()
      public entityId: string;
      @excludeFromIndex()
      public excludedField1: string;
      @excludeFromIndex()
      public excludedField2: number[];
    }

    let excludeFromIndexes: string[] = Reflect.getMetadata(
        METADATA_KEY.excludeFromIndexes,
        new MyEntity()
    );

    expect(excludeFromIndexes).contains("excludedField1");
    expect(excludeFromIndexes).contains("excludedField2");
    done();
  });
});
