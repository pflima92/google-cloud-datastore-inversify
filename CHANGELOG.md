# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/) 
and this project adheres to [Semantic Versioning](http://semver.org/).

## 0.4.1

* Fix released version

## 0.4.0

* Add `count` method to `Repository` interface based on find all keys approach
* Remove method `hasNext` on `PagedResponse` to map correctly the `moreResults` property from original response
* Add support for projections using `withSelect` method on `QueryRequest`

## 0.3.0

* Add `updatedAt` and `createdAt` audit decorators
* Add `PagedBaseRepository` allowing return a `PagedResponse`

## v0.2.1

* Fix `saveAll` on repository method
* Add `excludeLargeProperties` on `entityOptions` when decorate an `@entity`

## v0.2.0

* Update [Wiki](https://github.com/pflima92/google-cloud-datastore-inversify/wiki)
* Fix filter `Opeartors`
* Add `excludeFromIndex` decorator to exclude a specific property from indexes
* Add `entityOptions` for custom configurations
* Add `excludeExtraneousValues` that allows ensure all properties from the type class

## v0.1.2

* Export `TYPES` for `Datastore` binding

## v0.1.1

* Update `Filter` with missing fields
* Update internal `QueryBuilder` to map a `Query` from a `QueryRequest`
* Expose `Datastore` on `BaseRepository` allowing a Repository to extends it 
* Rename internal `Repostiory` interface to `CrudRepository`

## v0.1.0 - Initial release

Check out the [documentation](https://github.com/pflima92/google-cloud-datastore-inversify/wiki) for the released version.