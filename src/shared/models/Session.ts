import { Doc as CRDTDoc } from 'crdt';
import { computed, observable } from 'mobx';
import Doc, { IDoc, linked } from './Doc';

import createSeq from './createSeq';

import Store from 'shared/Store';

export interface ISession extends IDoc {
	ownerId: string;
	name: string;
}

class Session extends Doc<ISession> {
	@linked public readonly ownerId: string;
	@linked public name: string;
	@observable public userIds: string[];
	@computed get onlineUserIds() {
		return this.userIds.filter(userId => this.store.getUser(userId).connected);
	}
	@observable public itemIds: string[];

	constructor(store: Store, crdt: CRDTDoc<IDoc>, id: string, name: string, ownerId: string) {
		super(store, id, 'session');
		this.name = name;
		this.ownerId = ownerId;
		this.userIds = [];
		this.itemIds = [];

		this.initCRDT(crdt);
		createSeq(crdt, store, 'type', 'item', this.itemIds, row => row.get('id'));
		createSeq(crdt, store, 'type', 'user', this.userIds, row => row.get('id'));
	}

	public static instantiate(store: Store, crdt: CRDTDoc<IDoc>, { id, name, ownerId }: ISession): Session {
		return new Session(store, crdt, id, name, ownerId);
	}

	public toModel() {
		return this.createDoc({
			ownerId: this.ownerId,
			name: this.name
		});
	}
}

export default Session;
