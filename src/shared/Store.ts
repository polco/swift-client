import { Doc as CRDTDoc } from 'crdt';
import * as debug from 'debug-logger';
import { IObjectChange, observable } from 'mobx';
import * as dcstream from 'rtc-dcstream';
import * as uuid from 'uuid/v4';

import GatewayClient from 'shared/GatewayClient';

import Action from 'shared/actions/Action';
import CreateDoc from 'shared/actions/CreateDoc';
import UpdateDoc from 'shared/actions/UpdateDoc';
import UpdateSessionName from 'shared/actions/UpdateSessionName';
import UpdateUserName from 'shared/actions/UpdateUserName';

import Doc from 'shared/models/Doc';
import Item from 'shared/models/Item';
import Session, { ISession } from 'shared/models/Session';
import User, { IUser } from 'shared/models/User';

import RTCClient from 'shared/RTCClient';

const log = debug('swift:RTCClient');

export type DocChange = {
	name: string;
	docId: string;
	type: IObjectChange['type'];
	newValue: any;
};

class Store {
	@observable public sessionList: string[] = [];
	private docs: { [docId: string]: Doc } = {};
	public userId = 'user-' + uuid();
	private gatewayClient: GatewayClient;
	private RTCClients: { [userId: string]: RTCClient } = {};

	public crdts: {[sessionId: string]: CRDTDoc<ISession | IUser>} = {};
	public updating: {[id: string]: true} = {};

	public pendingSeqActions: Array<() => void> = [];

	constructor() {
		(window as any).store = this;
		(window as any).udpateUser = (name: string) => {
			this.executeAction(new UpdateUserName(this.userId, name));
		};
		(window as any).udpateSession = (name: string) => {
			const sessionId = this.sessionList[0];
			this.executeAction(new UpdateSessionName(sessionId, name));
		};

		this.gatewayClient = new GatewayClient(this.userId);
		this.gatewayClient.on('join', this.onJoin);
		this.gatewayClient.on('sessionUser', this.onSessionUser);
	}

	public applyPendingSeqAction() {
		if (this.pendingSeqActions.length) {
			this.pendingSeqActions.forEach(action => action());
			this.pendingSeqActions = [];
		}
	}

	public getDoc(docId: string): Doc {
		return this.docs[docId];
	}

	public addDoc(doc: Doc) {
		this.docs[doc.id] = doc;
	}

	private onJoin = (sessionId: string, userId: string) => {
		if (!this.crdts[sessionId]) { this.createCRDT(sessionId); }

		if (this.RTCClients[userId]) { return; } // TODO Handle same user with many sessions
		const client = this.RTCClients[userId] = new RTCClient(userId, this.gatewayClient);
		this.setupClient(client);
		client.on('connect', (dc) => {
			const stream = dcstream(dc);
			stream.pipe(this.crdts[sessionId].createStream()).pipe(stream);
		});
	}

	private onSessionUser = (sessionId: string, userId: string) => {
		if (!this.crdts[sessionId]) { this.createCRDT(sessionId); }

		if (this.RTCClients[userId]) { return; } // TODO Handle same user with many sessions
		const client = this.RTCClients[userId] = new RTCClient(userId, this.gatewayClient);
		this.setupClient(client);
		client.initiateConnection();
		client.on('connect', (dc) => {
			const stream = dcstream(dc);
			stream.pipe(this.crdts[sessionId].createStream()).pipe(stream);
		});
	}

	public createCRDT(sessionId: string) {
		const crdt = this.crdts[sessionId] = new CRDTDoc();

		// TODO: how do we deal with the same user in different CRDTDOC ?
		this.updating[this.userId] = true;
		const user = new User(this, crdt, this.userId, 'user');
		this.addDoc(user);
		delete this.updating[this.userId];

		crdt.on('row_update', (row) => {
			const id = row.get('id');
			if (this.updating[id]) { return; }
			this.updating[id] = true;

			if (this.docs[id]) {
				this.executeAction(new UpdateDoc(id, this.docs[id].changes));
			} else {
				this.executeAction(new CreateDoc(row.toJSON(), sessionId));
			}

			delete this.updating[id];
		});
	}

	private setupClient(client: RTCClient) {
		// client.on('get-docs', (docIds: string[]) => {
			// client.sendMessage('docs', docIds.map(docId => this.docs[docId].toModel()));
		// });

		// client.on('docs', (objects: any[]) => {
		// 	this.executeAction(new DocsUpdate(objects), true);
		// });

		// client.on('doc-changes', (docChanges) => {
			// const { changes, sessionId } = docChanges;
			// const session = this.docs[sessionId] as Session;
			// if (session.ownerId === this.user.id) { // send to others
			// 	for (const userId of session.userIds) {
			// 		this.RTCClients[userId].sendMessage('doc-changes', docChanges);
			// 	}
			// } else {
			// 	console.log(changes);
			// }
		// });
	}

	public openSession(sessionId: string) {
		this.gatewayClient.openSession(sessionId);
	}

	public closeSession(sessionId: string) {
		this.gatewayClient.closeSession(sessionId);
	}

	public join(sessionId: string) {
		return this.gatewayClient.joinSession(sessionId);
	}

	public getSession(sessionId: string): Session {
		return this.docs[sessionId] as Session;
	}

	public removeSession(sessionId: string) {
		const session = this.docs[sessionId] as Session;
		if (!session) { return log('trying to remove an inexisting session', sessionId); }
		delete this.docs[sessionId];
	}

	public getUser(userId: string): User {
		return this.docs[userId] as User;
	}

	public getItem(itemId: string): Item {
		return this.docs[itemId] as Item;
	}

	public executeAction<A extends Action>(action: A, sideEffect = false): A {
		action.run(this);
		return action;
	}
}

export default Store;
