import { Changed } from 'crdt';

import { IDoc } from 'shared/models/Doc';
import Action from './Action';

class UpdateDoc extends Action {
	private docId: string;
	private changes: Changed<IDoc>;

	constructor(docId: string, changes: Changed<IDoc>) {
		super('updateDoc');

		this.docId = docId;
		this.changes = changes;
	}

	protected execute() {
		const doc = this.store.getDoc(this.docId);

		for (const key in this.changes) {
			(doc as any)[key] = (this.changes as any)[key];
		}
		doc.changes = {};

		this.store.applyPendingSeqAction();

		return true;
	}
}

export default UpdateDoc;
