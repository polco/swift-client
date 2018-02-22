import Item, { IItem } from 'shared/models/Item';

import Action from './Action';

class AddItem extends Action {
	private item: IItem;
	private index: number;
	private sessionId: string;

	constructor(item: IItem, index: number, sessionId: string) {
		super('addItem');

		this.item = item;
		this.index = index;
		this.sessionId = sessionId;
	}

	protected execute() {
		if (!this.store.getItem(this.item.id) && !this.store.creating[this.item.id]) {
			this.store.creating[this.item.id] = true;
			const doc = Item.instantiate(this.store, this.store.crdts[this.sessionId], this.item);
			delete this.store.creating[this.item.id];
			this.store.addDoc(doc);
		}

		const session = this.store.getSession(this.sessionId);
		session.itemIds.splice(this.index, 0, this.item.id);
		return true;
	}
}

export default AddItem;
