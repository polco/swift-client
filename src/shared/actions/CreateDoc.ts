import { Row } from 'crdt';
import { IDoc } from 'shared/models/Doc';
import docClass from 'shared/models/docClass';
import Session from 'shared/models/Session';

import Action from './Action';

class CreateDoc extends Action {
	private row: Row<IDoc>;
	private sessionId: string;

	constructor(row: Row<IDoc>, sessionId: string) {
		super('createDoc');

		this.row = row;
		this.sessionId = sessionId;
	}

	protected execute() {
		const rowState = this.row.toJSON();
		this.store.creating[rowState.id] = true;
		const doc = docClass[rowState.type].instantiate(this.store.crdts[this.sessionId], rowState);
		delete this.store.creating[rowState.id];
		this.store.addDoc(doc);

		if (doc instanceof Session && !this.store.sessionList.includes(rowState.id)) {
			this.store.sessionList.push(rowState.id);
		}
		return true;
	}
}

export default CreateDoc;
