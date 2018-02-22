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

	constructor(crdt: CRDTDoc, id: string, name: string, ownerId: string, userIds: string[] = []) {
		super(id, 'session');
		this.name = name;
		this.ownerId = ownerId;
		this.userIds = userIds;

		this.initCRDT(crdt);
	}

	public static instantiate(
		crdt: CRDTDoc<IDoc>,
		{ id, name, ownerId, userIds }: { id: string, name: string, ownerId: string, userIds: string[] }): Session {
		return new Session(crdt, id, name, ownerId, userIds);
	}

	public toModel() {
		return this.createDoc({
			ownerId: this.ownerId,
			name: this.name,
			userIds: this.userIds,
		});
	}

	public belongToSessions() {
		return [this.id];
	}
}

export default Session;
