# `Transform` model

Represents a transform to the data structure. Specific kinds of transforms are [`NodeTransform`](./NodeTransform.md) and [`NodeListTransform`](./NodeListTransform.md).

## Properties

TODO

## Computed Properties

TODO

## Methods

TODO

## Notes

### Principles

#### Operational Transform

Transforms should conform to Operational Transformations (OT) principles, allowing:

* Management of undo/redo history
* Collaborative editing

#### Chainability

Transforms are _chainable_, in that they return a new `Transform`, which can be used to perform new transforms. 

Each Transform will provide access to the data structure as it looks with the Transform applied. Computation of the resulting data structure can be lazy (utilizing a getter) to avoid unnecessary processing.

### A few transforms

Transforms should allow common scenarios, such as:

* Reordering / sorting nodes
* Inserting node at index
* Grouping / ungrouping nodes
* Adding/removing/toggling Node metadata
