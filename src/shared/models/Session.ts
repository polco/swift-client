import { Doc as CRDTDoc, Seq } from 'crdt';
import { observable } from 'mobx';
import Doc, { IDoc, linked } from './Doc';
import { IItem } from './Item';

import AddItem from 'shared/actions/AddItem';
import RemoveItem from 'shared/actions/RemoveItem';

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
	@observable public itemIds!: string[];
	public itemSeq: Seq<IItem>;

	constructor(store: Store, crdt: CRDTDoc<IDoc>, id: string, name: string, ownerId: string, userIds: string[]) {
		super(store, id, 'session');
		this.name = name;
		this.ownerId = ownerId;
		this.userIds = userIds || [ownerId];

		this.initCRDT(crdt);

		this.itemSeq = crdt.createSeq('type', 'item');
		this.updateItemList();
		this.itemSeq.on('add', row => {
			const index = this.itemSeq.indexOf(row.get('id'));
			if (index !== -1) {
				this.store.executeAction(new AddItem(row.toJSON(), index, this.id));
			}
		});

		this.itemSeq.on('remove', row => {
			this.store.executeAction(new RemoveItem(row.get('id'), this.id));
		});
	}

	public updateItemList() {
		const itemIds: string[] = [];
		this.itemSeq.forEach(item => itemIds.push(item.get('id')));
		this.itemIds = itemIds;
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
