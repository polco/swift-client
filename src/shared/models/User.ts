import { Doc as CrdtDoc } from 'crdt';
import Store from 'shared/Store';
import Doc, { IDoc, linked } from './Doc';

export interface IUser extends IDoc {
	name: string;
}

class User extends Doc<IUser> {
	@linked public name: string;

	constructor(crdt: CrdtDoc, id: string, name: string) {
		super(id, 'user');
		this.name = name;
		this.initCRDT(crdt);
	}

	public static instantiate(crdt: CrdtDoc<IDoc>, { id, name }: { id: string, name: string }): User {
		return new User(crdt, id, name);
	}

	public toModel() {
		return this.createDoc({
			name: this.name
		});
	}

	public belongToSessions(store: Store) {
		return store.sessionList.reduce((sessions, sessionId) => {
			const session = store.getSession(sessionId);
			if (session.ownerId === this.id) {
				sessions.push(sessionId);
			} else {
				const index = session.userIds.indexOf(this.id);
				if (index !== -1) { sessions.push(sessionId); }
			}
			return sessions;
		}, [] as string[]);
	}
}

export default User;
