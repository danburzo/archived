# `Node` Model

A `Node` represents a single element somewhere in the hierarchy.

__A few examples of node kinds:__ `Object`, `Group`.

`Object` types: `Element`.
`Group` types: `Layer`, `Group`, `Symbol`, `Template`.

## Properties

### `key`

### `data`

Is a [`NodeData`](./NodeData.md) object.

### `nodes`

Is a [`NodeList`](./NodeList.md) object containing the child nodes.

## Computed Properties

TODO

## Methods

### `transform(): NodeTransform`

Returns a new [`NodeTransform`](./NodeTransform.md) for the Node.

## Notes

The Node should be able to answer questions such as:

* What are the unique values that exist in the data structure for a (potentially nested) metadata key?

e.g. finding out all font families used by the nodes in a structure, to facilitate loading them from an external data provider (Google Fonts, Typekit, etc.)