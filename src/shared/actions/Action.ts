import { action } from 'mobx';
import Store from 'shared/Store';

export type actionType = 'createSession';

abstract class IAction {
	public type: actionType;
	protected store!: Store;

	constructor(type: actionType) {
		this.type = type;
	}

	public run(store: Store) {
		this.store = store;
		action(this.type, () => this.execute())();
	}

	protected abstract execute(): boolean;
}

export default IAction;
