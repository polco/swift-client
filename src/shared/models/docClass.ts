import { Doc as CRDTDoc } from 'crdt';

import Doc, { DocType, IDoc } from './Doc';
import Item from './Item';
import Session from './Session';
import User from './User';

import Store from 'shared/Store';

const docClass: {[D in DocType]: {
	new(...args: any[]): Doc;
	instantiate(store: Store, crdt: CRDTDoc<IDoc>, data: any): Doc;
}} = {
	session: Session,
	user: User,
	item: Item
};

export default docClass;
