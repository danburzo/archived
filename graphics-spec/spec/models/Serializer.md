# `Serializer` model

## Properties

TODO

## Computed Properties

TODO

## Methods

### `serialize(data: State, options: Object): Any`

### `deserialize(data: Any, options: Object): State`

## Notes

We qualify a Serializer as being __complete__ if it can be adequately used to store the [`State`](./State.md) into a different format. More formally:

```js
State = Serializer.deserialize( Serializer.serialize( State ) )
```

Similarly, we qualify a Serializer as being __lossless__ if data in a target format (e.g. HTML) can be passed through the Serializer without losing any data:

```js
SerializedData = Serializer.serialize( Serializer.deserialize( SerializedData ) )
```

There needs to exist at least one serializer that is both __complete__ and __lossless__. A good candidate for this is a JSON serializer.

Another __complete__ and __lossless__ serializer can be a DOM Serializer for a subset of supported HTML/SVG content. (Any additional information regarding the state which cannot be represented as HTML/SVG can be serialized as `data-` attributes).

Other serializers, due to their nature, will not be __complete__ nor __lossless__ and will be used purely to obtain a one-way representation of the state (or some aspects of it), without the expectation to read it back. 

Some examples of __partial__ or __lossy__ serializers are:

* A CSS serializer that creates a flat representation of the Nodes' attributes in CSS syntax.
* A serializer that transforms the state into imperative code (e.g. serializing to DOMCanvas, or platform-specific code instructions).