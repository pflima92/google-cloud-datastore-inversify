import { expect } from "chai";
import { repository } from "../src/decorators";
import { interfaces } from "../src/interfaces";
import { METADATA_KEY } from "../src/constants";

describe("Unit Test: Repository Decorators", () => {

    it("should add repository metadata to a class when decorated with @repository", (done) => {

        class MyEntity { }

        @repository(MyEntity)
        class TestRepository { }

        let controllerMetadata: interfaces.RepositoryMetadata = Reflect.getMetadata(
            METADATA_KEY.repository,
            TestRepository
        );

        expect(controllerMetadata.target).eql(TestRepository);
        done();
    });
});
