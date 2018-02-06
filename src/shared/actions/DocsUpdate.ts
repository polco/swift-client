import { DocType } from 'shared/models/Doc';

import docClass from 'shared/models/docClass';

import Action from './Action';

class DocsUpdate extends Action {
	private objects: Array<{ id: string, type: DocType }>;

	constructor(objects: Array<{ id: string, type: DocType }>) {
		super('docsUpdate');

		this.objects = objects;
	}

	protected execute() {
		for (const object of this.objects) {
			if (this.store.getDoc(object.id)) {
				this.store.getDoc(object.id).merge(object);
			} else {
				this.store.addDoc(docClass[object.type].instantiate(object));
			}
		}
		return true;
	}
}

export default DocsUpdate;
