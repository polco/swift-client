import Session from 'shared/models/Session';

import Action from './Action';

class CreateSession extends Action {
	private id: string;
	private name: string;
	private ownerId: string;

	constructor(id: string, name: string, ownerId: string) {
		super('createSession');

		this.id = id;
		this.name = name;
		this.ownerId = ownerId;
	}

	protected execute() {
		if (!this.store.crdts[this.id]) {
			this.store.createCRDT(this.id);
		}
		this.store.creating[this.id] = true;
		const session = new Session(this.store.crdts[this.id], this.id, this.name, this.ownerId);
		delete this.store.creating[this.id];
		this.store.sessionList.push(this.id);
		this.store.addDoc(session);
		return true;
	}
}

export default CreateSession;
