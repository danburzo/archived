# `Selection` model

Represents the set of selected nodes. Extends the [`NodeList`](./NodeList.md) model.

## Properties

TODO

## Computed Properties

TODO

## Methods

`Selection` inherits methods from [`NodeList`](./NodeList.md).

### `toggle(Node): Selection` _(Convenience)_

Selects or deselects the Node based on whether it's already in the list.

## Notes

* Should the selection be immutable?
* Should the selection be a Set instead?
* Should we allow mutating objects in the selection?