import { observable } from 'mobx';

import Doc from './Doc';

class Session extends Doc {
	public readonly ownerId: string;
	@observable public name: string;
	@observable public userIds:  string[];

	constructor(id: string, name: string, ownerId: string, userIds: string[] = []) {
		super(id, 'session');

		this.name = name;
		this.ownerId = ownerId;
		this.userIds = [];
	}

	public static instantiate(
		{ id, name, ownerId, userIds }: { id: string, name: string, ownerId: string, userIds: string[] }): Session {
		return new Session(id, name, ownerId, userIds);
	}

	public toModel() {
		return this.createDoc({
			ownerId: this.ownerId,
			name: this.name,
			userIds: this.userIds,
		});
	}

	public merge(obj: any) {
		if (this.name !== obj.name) {
			this.name = obj.name;
		}

		if (this.userIds.length !== obj.userIds.length) {
			this.userIds = obj.userIds;
		} else {
			for (let i = 0; i < this.userIds.length; i += 1) {
				if (this.userIds[i] !== obj.userIds[i]) {
					this.userIds = obj.userIds;
					break;
				}
			}
		}
	}
}

export default Session;
