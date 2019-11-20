# Inversify - Google Cloud Datastore 

[![Build Status](https://travis-ci.com/pflima92/google-cloud-datastore-inversify.svg?branch=master)](https://travis-ci.com/pflima92/google-cloud-datastore-inversify)
[![npm version](https://badge.fury.io/js/inversify-datastore.svg)](https://badge.fury.io/js/inversify-datastore)
[![Dependencies](https://david-dm.org/pflima92/google-cloud-datastore-inversify.svg)](https://david-dm.org/pflima92/google-cloud-datastore-inversify#info=dependencies)

Some utilities for the development of Google Cloud Datastore applications using Inversify.

## Installation

You can install `inversify-datastore` using npm:

```sh
npm install inversify inversify-datastore reflect-metadata @google-cloud/datastore --save
```

The `inversify-datastore` type definitions are included in the npm module and require TypeScript 2.0.
Please refer to the [InversifyJS documentation](https://github.com/inversify/InversifyJS#installation) to learn more about the installation process.

## The Basics

### Step 1: Decorate your repository

To use a class as a "repository" for your node app, simply add the `@repository` decorator to the class. 

```ts
import { entity, id, repository } from 'datastore-inversify';

@entity('UserKind')
class User {
    @id()
    id: string;
    name: string;
}

@repository(User)
class UserRepository<User> extends BaseRepository<User> {
}

export {User, UserRepository}
```

### Step 2: Configure container

Configure the inversify container in your composition root as usual.

```ts
import { Container } from 'inversify';
import { TYPES } from 'inversify-datastore';

// set up container
let container = new Container();

// set up datastore
let datastore = new Datastore();

// set up bindings
container.bind(TYPES.Datastore).toConstantValue(datastore);

// Bind your repositories
container.bind<UserRepository>(UserRepository).toSelf();
```

## Documentation

Read the [basics](https://github.com/pflima92/google-cloud-datastore-inversify#the-basics) for a 2 minutes introduction. After that, head to the [documentation](https://github.com/pflima92/google-cloud-datastore-inversify/wiki), or checkout the [source code](https://github.com/pflima92/google-cloud-datastore-inversify-example) of the demo for an example usage.

## License

License under the MIT License (MIT)

Copyright © 2019 [Paulo Lima](https://github.com/pflima92)

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.

IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
