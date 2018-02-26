import Action from './Action';

class SetUserConnected extends Action {
	private userId: string;
	private connected: boolean;

	constructor(userId: string, connected: boolean) {
		super('setUserConnected');

		this.userId = userId;
		this.connected = connected;
	}

	protected execute() {
		const user = this.store.getUser(this.userId);
		user.connected = this.connected;
		return true;
	}
}

export default SetUserConnected;
