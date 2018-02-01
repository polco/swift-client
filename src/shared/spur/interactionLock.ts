import { EventEmitter } from 'events';

class InteractionLock extends EventEmitter {
	private lockNodes: { [lockId: number]: Node } = {};
	private lockContainerNodes: { [lockId: number]: Node } = {};
	private lockId = 0;

	public isLocked(DOMNode: Node): boolean {
		for (const id in this.lockNodes) {
			let node: Node | null = this.lockNodes[id];
			while (node !== null) {
				if (node === DOMNode) { return true; }
				node = node.parentNode;
			}
		}

		for (const id in this.lockContainerNodes) {
			const container = this.lockContainerNodes[id];
			let parent: Node | null = DOMNode;
			while (parent !== null) {
				if (parent === container) { return true; }
				parent = parent.parentNode;
			}
		}

		return false;
	}

	public requestLockOn(DOMNode: Node): number | null {
		if (this.isLocked(DOMNode)) { return null; }

		this.lockId += 1;
		this.lockNodes[this.lockId] = DOMNode;
		this.emit('element-lock', DOMNode);
		return this.lockId;
	}

	public requestContainerLockOn(DOMNode: Node): number | null {
		if (this.isLocked(DOMNode)) { return null; }

		this.lockId += 1;
		this.lockContainerNodes[this.lockId] = DOMNode;
		this.emit('container-lock', DOMNode);
		return this.lockId;
	}

	public releaseLock(id: number) {
		const DOMNode = this.lockNodes[id] || this.lockContainerNodes[id];
		if (DOMNode) {
			delete this.lockNodes[id];
			delete this.lockContainerNodes[id];
			this.lockId -= 1;
			this.emit('unlock', DOMNode);
		}
	}
}

export default new InteractionLock();
