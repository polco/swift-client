import { Doc as CrdtDoc } from 'crdt';
import Doc, { IDoc, linked } from './Doc';

import Store from 'shared/Store';

export type TextItem = { type: 'text', content: string };

export type ItemContent = TextItem;

export interface IItem extends IDoc {
	creatorId: string;
	creationDate: string;
	itemContent: ItemContent;
}

class Item extends Doc<IItem> {
	@linked public creatorId: string;
	@linked public creationDate: string;
	@linked public itemContent: ItemContent;

	constructor(
		store: Store, crdt: CrdtDoc<IDoc>, id: string, creatorId: string, creationDate: string, itemContent: ItemContent
	) {
		super(store, id, 'item');
		this.creatorId = creatorId;
		this.creationDate = creationDate;
		this.itemContent = itemContent;
		this.initCRDT(crdt);
	}

	public static instantiate(
		store: Store, crdt: CrdtDoc<IDoc>, { id, creatorId, creationDate, itemContent }: IItem
	): Item {
		return new Item(store, crdt, id, creatorId, creationDate, itemContent);
	}

	public toModel() {
		return this.createDoc({
			creationDate: this.creationDate,
			creatorId: this.creatorId,
			itemContent: this.itemContent
		});
	}
}

export default Item;
