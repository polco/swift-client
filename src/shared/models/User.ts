import { Doc as CrdtDoc } from 'crdt';
import Doc, { IDoc, linked } from './Doc';

import Store from 'shared/Store';

export interface IUser extends IDoc {
	name: string;
}

class User extends Doc<IUser> {
	@linked public name: string;

	constructor(store: Store, crdt: CrdtDoc, id: string, name: string) {
		super(store, id, 'user');
		this.name = name;
		this.initCRDT(crdt);
	}

	public static instantiate(store: Store, crdt: CrdtDoc<IDoc>, { id, name }: IUser): User {
		return new User(store, crdt, id, name);
	}

	public toModel() {
		return this.createDoc({
			name: this.name
		});
	}
}

export default User;
