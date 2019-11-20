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

    @entity("MyEntityKind")
    class MyEntity {
      @id()
      public entityId: string;
    }

    let kind: string = Reflect.getMetadata(
        METADATA_KEY.entity,
        MyEntity
    );

    let entityId: string = Reflect.getMetadata(
        METADATA_KEY.entityId,
        new MyEntity()
    );

    expect(kind).eql("MyEntityKind");
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
