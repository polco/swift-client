import Action from './Action';

class AddSessionUser extends Action {
	private sessionId: string;
	private userId: string;

	constructor(sessionId: string, userId: string) {
		super('addSessionUser');

		this.sessionId = sessionId;
		this.userId = userId;
	}

	protected execute() {
		const session = this.store.getSession(this.sessionId);
		session.userIds.push(this.userId);
		return true;
	}
}

export default AddSessionUser;
