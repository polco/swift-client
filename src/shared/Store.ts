import { observable } from 'mobx';

import Action from 'shared/actions/Action';
import Session from 'shared/models/Session';

class Store {
	@observable public sessions: Session[] = [];

	constructor() {
		(window as any).store = this;
	}

	public executeAction<A extends Action>(action: A): A {
		action.run(this);
		return action;
	}
}

export default Store;
