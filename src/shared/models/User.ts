import { observable } from 'mobx';

import Doc from './Doc';

class User extends Doc {
	@observable public name: string;

	constructor(id: string, name: string) {
		super(id, 'user');

		this.name = name;
	}

	public static instantiate({ id, name }: { id: string, name: string }): User {
		return new User(id, name);
	}

	public toModel() {
		return this.createDoc({
			name: this.name
		});
	}

	public merge(obj: any) {
		if (this.name !== obj.name) {
			this.name = obj.name;
		}
	}
}

export default User;
