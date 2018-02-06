import { observable } from 'mobx';

class User {
	@observable public name: string;

	constructor(name: string) {
		this.name = name;
	}
}

export default User;
