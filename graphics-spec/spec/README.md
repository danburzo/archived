# Graphics Specification

## Concepts

At the topmost level, we have a [`State`](./models/State.md) object that contains references to a [`Document`](./models/Document.md) (a hierarchy of [`Node`](./models/Node.md) objects) and a [`Selection`](./models/Selection.md) object.

The `Document` and `Selection` can be changed by means of [`Transforms`](./models/Transform.md).

Related concepts:

* [`Serializers`](./models/Serializer.md), which can transform the `State` object to/from various formats.
* [`Schemas`](./models/Schema.md) make sure that the `Document` and `Selection` obey a set of `Rules`.

## Model Reference

* [`Document`](./models/Document.md)
* [`History`](./models/History.md)
* [`Node`](./models/Node.md)
* [`NodeList`](./models/NodeList.md)
* [`NodeData`](./models/NodeData.md)
* [`Schema`](./models/Schema.md)
* [`Selection`](./models/Selection.md)
* [`Serializer`](./models/Serializer.md)
* [`State`](./models/State.md)

## Principles

### The Data Structure is immutable

To aid in efficiently updating UI in response to changes in the Data Structure, we enforce it to be immutable. In practice, this means any change to an object in the hierarchy will result in a new Data Structure, where, at any step in the hierarchy:

1. In place of any changed objects, we return references to new objects that have the changes applied to them.
2. If an object has not changed, we return the same reference to it.

This makes it easy to decide at the UI level which sub-tree of the DOM needs updating by simple comparison by reference. [React](https://facebook.github.io/react) (and, in particular, the `shouldComponentUpdate` method) is particularly suited for this approach.

### The spec provides a minimal API surface

This spec should focus on identifying a minimum, fairly low-level API that's easy to understand and internalize. Convenience methods can be implemented separately out of the primitives provided by the API.

### The spec/framework is extensible

The spec should make sure any underlying assumptions can be overriden through plugins. Make it easy to create plugins to handle convenience and extend the framework.

### The framework makes it easy to deploy to collaborative environments

See [`Transform`](./models/Transform.md) for details.

## Prior art

* [Slate](https://github.com/ianstormtaylor/slate)
* [Sketch data format](../prior-art/sketch.json)