import { Doc as CRDTDoc } from 'crdt';
import { observable } from 'mobx';
import Doc, { IDoc, linked } from './Doc';

import createSeq from './createSeq';

import Store from 'shared/Store';

export interface ISession extends IDoc {
	ownerId: string;
	name: string;
	userIds: string[];
}

class Session extends Doc<ISession> {
	@linked public readonly ownerId: string;
	@linked public name: string;
	@linked public userIds: string[];
	@observable public itemIds: string[];

	constructor(store: Store, crdt: CRDTDoc<IDoc>, id: string, name: string, ownerId: string, userIds: string[]) {
		super(store, id, 'session');
		this.name = name;
		this.ownerId = ownerId;
		this.userIds = userIds || [ownerId];
		this.itemIds = [];

		this.initCRDT(crdt);

		createSeq(crdt, store, 'type', 'item', this.itemIds, (row) => {
			return row.get('id');
		});
	}

	public static instantiate(store: Store, crdt: CRDTDoc<IDoc>, { id, name, ownerId, userIds }: ISession): Session {
		return new Session(store, crdt, id, name, ownerId, userIds);
	}

	public toModel() {
		return this.createDoc({
			ownerId: this.ownerId,
			name: this.name,
			userIds: this.userIds
		});
	}
}

export default Session;
