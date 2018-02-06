import Session from 'shared/models/Session';
import Action from './Action';

class AddSession extends Action {
	private sessionId: string;
	private userId: string;

	constructor(sessionId: string, userId: string) {
		super('addSession');

		this.sessionId = sessionId;
		this.userId = userId;
	}

	protected execute() {
		this.store.sessionList.push(this.sessionId);
		this.store.addDoc(new Session(this.sessionId, '', this.userId));
		return true;
	}
}

export default AddSession;
