# `History` Model

Holds the undo/redo history (a stack of [`Transform`](./Transform.md) objects).

## Properties

TODO

## Computed Properties

### `hasUndo(): Boolean`

### `hasRedo(): Boolean`

## Methods

### `push()`

Push a new operation to the history.

### `replace()`

Replace the last operation in the history with another one.

### `undo()`

Perform an _Undo_ action.

### `redo()`

Perform a _Redo_ action.