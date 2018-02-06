import Session from 'shared/models/Session';
import User from 'shared/models/User';

import Action from './Action';

class CreateSession extends Action {
	private id: string;
	private name: string;
	private userName: string;

	constructor(id: string, name: string, userName: string) {
		super('createSession');

		this.id = id;
		this.name = name;
		this.userName = userName;
	}

	protected execute() {
		this.store.sessions.push(new Session(this.id, this.name, [new User(this.userName)]));
		return true;
	}
}

export default CreateSession;
