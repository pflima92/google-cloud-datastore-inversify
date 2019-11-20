import {expect} from "chai";
import {entity, id, interfaces, repository} from "../src";
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
});
