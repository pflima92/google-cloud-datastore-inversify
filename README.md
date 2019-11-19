# Google Cloud Datastore Inversify

Some utilities for the development of Google Cloud Datastore applications using Inversify.

## Installation

You can install `inversify-datastore` using npm:

```sh
npm install inversify inversify-datastore reflect-metadata --save
```

The `inversify-datastore` type definitions are included in the npm module and require TypeScript 2.0.
Please refer to the [InversifyJS documentation](https://github.com/inversify/InversifyJS#installation) to learn more about the installation process.

## The Basics

### Step 1: Decorate your repository

To use a class as a "repository" for your node app, simply add the `@repository` decorator to the class. 

```ts
import { entity, key, repository } from 'datastore-inversify';

@entity('UserKind')
class User {
    @key
    id: string;
    name: string;
}

@repository(User)
class UserRepository<User> extends BaseRepository<User> {

    exists(id: any, ns?: Namespaced): Promise<boolean>;
    exists(queryRequest?: QueryRequest): Promise<boolean>;
    findById(id: any, ns?: Namespaced): Promise<User>;
    findAll(queryRequest?: QueryRequest): Promise<User[]>;
    findAllById(ids: any[], ns?: Namespaced): Promise<User[]>;
    save(t: User, ns?: Namespaced): Promise<User>;
    saveAll(ts: User[], ns?: Namespaced): Promise<User[]>;
    remove(t: User, ns?: Namespaced): Promise<boolean>;
    remove(id: any, ns?: Namespaced): Promise<boolean>;
    removeAll(t: User[], ns?: Namespaced): Promise<boolean>;
    removeAll(id: any[], ns?: Namespaced): Promise<boolean>;
}
```

### Step 2: Configure container

Configure the inversify container in your composition root as usual.

```ts
import { Container } from 'inversify';

// set up container
let container = new Container();

// set up bindings
container.bind<UserRepository>(UserRepository).toSelf();
container.bind<FooService>('FooService').to(FooService);

@injectable()
class FooService {

    repository: UserRepository;

    constructor(@inject(UserRepository) repository: UserRepository){
        this.repository = repository;
    }
}

```
## Examples

Some examples can be found at the [google-cloud-datastore-inversify-example](https://github.com/pflima92/google-cloud-datastore-inversify-example) repository.

## License

License under the MIT License (MIT)

Copyright © 2019 [Paulo Lima](https://github.com/pflima92)

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.

IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
