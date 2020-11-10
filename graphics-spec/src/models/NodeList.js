import NodeListTransform from './NodeListTransform';
import { List } from 'immutable';

class NodeList {

	static create(iterable = []) {
		return List.isList(iterable) ? iterable : new List(iterable);
	}

	constructor(iterable = []) {
		this.nodes = NodeList.create(iterable);
	}

	get first() {
		return this.nodes.get(0);
	}

	get size() {
		return this.nodes.size;
	}

	contains(node) {
		// todo
	}

	transform() {
		return new NodeListTransform(this);
	}
}

export default NodeList;