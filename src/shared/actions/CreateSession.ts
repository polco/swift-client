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
		const session = new Session(this.id, this.name, this.ownerId);
		this.store.sessionList.push(this.id);
		this.store.addDoc(session);
		return true;
	}
}

export default CreateSession;
