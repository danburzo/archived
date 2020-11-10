import NodeList from './NodeList';

export default class Selection extends NodeList {
	
	isSelected(node) {
		// todo
	}

	toggle(node) {
		if (this.contains(node)) {
			this.remove(node);
		} else {
			this.add(node);
		}
	}
}