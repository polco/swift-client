import Action from './Action';

class UpdateUserName extends Action {
	private name: string;

	constructor(name: string) {
		super('updateUserName');

		this.name = name;
	}

	protected execute() {
		for (const userId in this.store.userIdPerSessionId) {
			const user = this.store.getUser(userId);
			user.name = this.name;
		}
		return true;
	}
}

export default UpdateUserName;
