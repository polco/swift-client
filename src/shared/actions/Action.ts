import { action } from 'mobx';
import Store from 'shared/Store';

export type ActionsType =
	'createSession' | 'updateSessionName' | 'updateDoc' | 'setUserConnected' |
	'updateUserName' | 'addSession' | 'createDoc' | 'addItem' | 'removeItem';

abstract class IAction {
	public type: ActionsType;
	protected store!: Store;

	constructor(type: ActionsType) {
		this.type = type;
	}

	public run(store: Store) {
		this.store = store;
		action(this.type, () => this.execute())();
	}

	protected abstract execute(): boolean;
}

export default IAction;
