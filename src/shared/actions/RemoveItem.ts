import Action from './Action';

class RemoveItem extends Action {
	private itemId: string;
	private sessionId: string;

	constructor(itemId: string, sessionId: string) {
		super('removeItem');

		this.itemId = itemId;
		this.sessionId = sessionId;
	}

	protected execute() {
		const session = this.store.getSession(this.sessionId);
		const index = session.itemIds.indexOf(this.itemId);
		if (index !== -1) {
			session.itemIds.splice(index, 1);
		}
		return true;
	}
}

export default RemoveItem;
