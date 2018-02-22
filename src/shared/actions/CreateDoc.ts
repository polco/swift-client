import { IDoc } from 'shared/models/Doc';
import docClass from 'shared/models/docClass';
import Session from 'shared/models/Session';

import Action from './Action';

class CreateDoc<D extends IDoc> extends Action {
	private row: D;
	private sessionId: string;

	constructor(row: D, sessionId: string) {
		super('createDoc');

		this.row = row;
		this.sessionId = sessionId;
	}

	protected execute() {
		const doc = docClass[this.row.type].instantiate(this.store, this.store.crdts[this.sessionId], this.row);
		this.store.addDoc(doc);

		if (doc instanceof Session && !this.store.sessionList.includes(this.row.id)) {
			this.store.sessionList.push(this.row.id);
		}

		this.store.applyPendingSeqAction();

		return true;
	}
}

export default CreateDoc;
