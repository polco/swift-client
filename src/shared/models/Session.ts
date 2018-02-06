import { observable } from 'mobx';

import User from './User';

class Session {
	public readonly id: string;
	@observable public name: string;
	@observable public users:  User[];

	constructor(id: string, name: string, users: User[]) {
		this.id = id;
		this.name = name;
		this.users = users;
	}
}

export default Session;
