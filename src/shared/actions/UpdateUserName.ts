import Action from './Action';

class UpdateUserName extends Action {
	private userId: string;
	private name: string;

	constructor(userId: string, name: string) {
		super('updateUserName');

		this.userId = userId;
		this.name = name;
	}

	protected execute() {
		const user = this.store.getUser(this.userId);
		user.name = this.name;
		return true;
	}
}

export default UpdateUserName;
