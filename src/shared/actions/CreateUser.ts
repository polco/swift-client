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
		const user = new User(this.id, this.name);
		this.store.addDoc(user);
		return true;
	}
}

export default CreateUser;
