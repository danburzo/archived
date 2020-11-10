import { Stack } from 'immutable';

export default class History {

	constructor({ undo, redo } = {}) {
		this.undo_stack = new Stack(undo);
		this.redo_stack = new Stack(redo);
	}

	get hasUndo() {

	}

	get hasRedo() {

	}

	push() {}

	replace() {}

	undo() {}

	redo() {}
}