import NodeTransform from './NodeTransform';
import NodeList from './NodeList';
import NodeData from './NodeData';

import { generateKey } from '../utils/key';

class Node {
	constructor(node = {}) {
		this.key = node.key || generateKey();
		this.data = new NodeData(node.data);
		this.nodes = new NodeList(node.nodes);
	}

	transform() {
		return new NodeTransform(this);
	}
}

export default Node;