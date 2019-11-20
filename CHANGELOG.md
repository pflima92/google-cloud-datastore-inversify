# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/) 
and this project adheres to [Semantic Versioning](http://semver.org/).

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