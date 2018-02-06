import Action from './Action';

class AddSessionUser extends Action {
	private id: string;
	private userId: string;

	constructor(id: string, userId: string) {
		super('addSessionUser');

		this.id = id;
		this.userId = userId;
	}

	protected execute() {
		const session = this.store.getSession(this.id);
		session.userIds.push(this.userId);
		return true;
	}
}

export default AddSessionUser;
