import { Doc as CRDTDoc } from 'crdt';
import Doc, { IDoc, linked } from './Doc';

export interface ISession extends IDoc {
	ownerId: string;
	name: string;
	userIds: string[];
}

class Session extends Doc<ISession> {
	@linked public readonly ownerId: string;
	@linked public name: string;
	@linked public userIds: string[];
	// public crdt: CRDTDoc<ISession>;

	constructor(crdt: CRDTDoc, id: string, name: string, ownerId: string, userIds: string[] = []) {
		super(id, 'session');
		this.name = name;
		this.ownerId = ownerId;
		this.userIds = userIds;
		// this.crdt = new CRDTDoc();
		this.initCRDT(crdt);
	}

	// public static instantiate(
	// 	{ id, name, ownerId, userIds }: { id: string, name: string, ownerId: string, userIds: string[] }): Session {
	// 	return new Session(id, name, ownerId, userIds);
	// }

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

	public belongToSessions() {
		return [this.id];
	}
}

export default Session;
