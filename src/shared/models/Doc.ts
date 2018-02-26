import { Atom } from 'mobx';

import Store from 'shared/Store';

import { Doc as CrdtDoc, Row as CrdtDow } from 'crdt';

export type DocType = 'session' | 'user' | 'item';

export function linked(docPrototype: any, property: string) {
	const atom = new Atom(property);

	const getter = function(this: Doc) {
		atom.reportObserved();
		return (this as any).__data[property];
	};

	const setter = function(this: Doc, val: any) {
		const value = (this as any).__data[property];
		if (value === val) { return; }
		(this as any).__data[property] = val;
		if (this.row && this.row.get(property) !== val) {
			this.row.set(property, val);
		}
		atom.reportChanged();
	};

	if (delete docPrototype[property]) {
		Object.defineProperty(docPrototype, property, {
			get: getter,
			set: setter
		});
	}
}

export interface IDoc {
	id: string;
	type: DocType;
}

abstract class Doc<M extends IDoc = any> {
	protected __data = {};
	@linked public readonly id: string;
	@linked public readonly type: DocType;
	public row!: CrdtDow<M>;
	protected store: Store;
	public changes: {[K in keyof M]?: M[K]};

	constructor(store: Store, id: string, type: DocType) {
		this.store = store;
		this.id = id;
		this.type = type;
		this.changes = {};
	}

	protected initCRDT(crdt: CrdtDoc): void {
		this.row = crdt.get(this.id);
		if (!this.row.get('type')) {
			this.row.set(this.toModel());
		}

		this.row.on('change', (changed) => {
			Object.assign(this.changes, changed);
		});
	}

	protected createDoc<O>(obj: O): O & IDoc {
		return Object.assign(obj, { id: this.id, type: this.type });
	}

	public abstract toModel(): M;
}

export default Doc;