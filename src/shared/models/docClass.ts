import { Doc as CRDTDoc } from 'crdt';

import Doc, { DocType, IDoc } from './Doc';
import Session from './Session';
import User from './User';

const docClass: {[D in DocType]: {
	new(...args: any[]): Doc;
	instantiate(crdt: CRDTDoc<IDoc>, data: any): Doc;
}} = {
	session: Session,
	user: User
};

export default docClass;
