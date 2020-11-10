# `NodeListTransform` model

Represents a transform of a [`NodeList`](./NodeList.md). Extends the [`Transform`](./Transform.md) model.

## Properties

TODO

## Computed Properties

TODO

## Methods

### `add(node: Node): NodeList`

Adds the node to the list.

### `remove(node: Node): NodeList`

Removes the node from the list.

### `reset(iterable: NodeList | Array<Node>): NodeList`

Creates a new NodeList with a new set of nodes.

### `wrap(node: Node): NodeList`

Wraps the nodes in the list in a Node, i.e. the nodes will become children for this new node.

### `unwrap(): NodeList`

Unwraps the nodes in the list.