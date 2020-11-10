# `NodeList` model

A `NodeList` is a wrapper over a list of [`Node`](../Node.md) elements.

## Properties

TODO

## Computed Properties

### `first`

Returns the first `Node` in the list.

### `size`

Returns the size of the list.

## Methods

### `contains(node: Node): Boolean`

Returns whether the `Node` is present in the list.

### `transform(): NodeListTransform`

Returns a new [`NodeListTransform`](./NodeListTransform.md) for the list.

## Notes

A few useful methods:

* `getIn` will return a value nested deep into the hierarchy 