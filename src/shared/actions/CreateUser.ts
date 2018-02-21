import User from 'shared/models/User';

import Action from './Action';

class CreateUser extends Action {
	private id: string;
	private name: string;

	constructor(id: string, name: string) {
		super('createUser');

		this.id = id;
		this.name = name;
	}

	protected execute() {
		this.store.creating[this.id] = true;
		const user = new User(this.store.userCRDT, this.id, this.name);
		delete this.store.creating[this.id];
		this.store.addDoc(user);
		return true;
	}
}

export default CreateUser;
