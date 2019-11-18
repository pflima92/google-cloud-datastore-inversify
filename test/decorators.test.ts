import {expect} from "chai";
import {entity, repository} from "../src";
import {interfaces} from "../src";
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
