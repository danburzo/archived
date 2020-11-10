## `Schema` model

## Properties

TODO

## Computed properties

TODO

## Methods

TODO

## Notes

A Schema will enforce some `Rules` and _normalize_ the data structure based on those rules.

Examples of rules:

* A `Group` cannot be empty — if it is, remove it from the data structure.
* An `Object` will always be a _leaf node_ in the data structure — it cannot have nested `Node`s inside it.