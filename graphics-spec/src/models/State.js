import Document from './Document';
import Selection from './Selection';

export default class State {
	constructor(state = {}) {
		this.document = new Document(state.document);
		this.selection = new Selection(state.selection);
	}
}