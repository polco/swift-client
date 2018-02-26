import { Doc as CrdtDoc } from 'crdt';
import Doc, { IDoc, linked } from './Doc';

import Store from 'shared/Store';

export interface IUser extends IDoc {
	name: string;
	connected: boolean;
}

class User extends Doc<IUser> {
	@linked public name: string;
	@linked public connected: boolean;

	constructor(store: Store, crdt: CrdtDoc, id: string, name: string, connected?: boolean) {
		super(store, id, 'user');
		this.name = name;
		this.connected = connected || false;
		this.initCRDT(crdt);
	}

	public static instantiate(store: Store, crdt: CrdtDoc<IDoc>, { id, name, connected }: IUser): User {
		return new User(store, crdt, id, name, connected);
	}

	public toModel() {
		return this.createDoc({
			name: this.name,
			connected: this.connected
		});
	}
}

export default User;
