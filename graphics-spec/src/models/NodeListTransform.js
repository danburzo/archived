import Transform from './Transform';

export default class NodeListTransform extends Transform {
	add(node) {
		// todo
	}

	remove(node) {
		// todo
	}

	reset(iterable) {
		return NodeList.create(iterable);
	}
}