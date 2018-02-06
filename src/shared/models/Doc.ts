import { Lambda } from 'mobx';

export type DocType = 'session' | 'user';

abstract class Doc {
	public readonly id: string;
	public readonly type: DocType;
	public disposeObserver!: Lambda;

	constructor(id: string, type: DocType) {
		this.id = id;
		this.type = type;
	}

	protected createDoc(obj: object): object {
		return Object.assign(obj, { id: this.id, type: this.type });
	}

	public abstract toModel(): object;
	public abstract merge(obj: any): void;
}

export default Doc;
