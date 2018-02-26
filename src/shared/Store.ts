import { Doc as CRDTDoc } from 'crdt';
import * as debug from 'debug-logger';
import { IObjectChange, observable, observe } from 'mobx';
import * as dcstream from 'rtc-dcstream';
import * as uuid from 'uuid/v4';

import GatewayClient from 'shared/GatewayClient';

import Action from 'shared/actions/Action';
import CreateDoc from 'shared/actions/CreateDoc';
import UpdateDoc from 'shared/actions/UpdateDoc';

import Doc from 'shared/models/Doc';
import Item from 'shared/models/Item';
import Session, { ISession } from 'shared/models/Session';
import User, { IUser } from 'shared/models/User';

import RTCClient from 'shared/RTCClient';
import * as UAParser from 'ua-parser-js';
import SetUserConnected from './actions/SetUserConnected';

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
	// public userId = 'user-' + uuid();
	@observable public userName: string;
	private gatewayClient: GatewayClient;
	private RTCClients: { [clientId: string]: RTCClient } = {};

	public crdts: {[sessionId: string]: CRDTDoc<ISession | IUser>} = {};
	public updating: {[id: string]: true} = {};

	public pendingSeqActions: Array<() => void> = [];

	public userIdPerSessionId: {[sessionId: string]: string} = {};
	public userIdsPerClientId: {[clientId: string]: string[]} = {};

	constructor() {
		(window as any).store = this;

		const parser = new UAParser();
		const res = parser.getResult();
		this.userName = res.os.name + ' - ' + res.browser.name;

		this.gatewayClient = new GatewayClient();
		this.gatewayClient.on('join', this.onJoin);
		this.gatewayClient.on('sessionClient', this.onSessionUser);
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

	private onJoin = (sessionId: string, clientId: string, userId: string) => {
		if (!this.crdts[sessionId]) { this.createCRDT(sessionId); }
		if (!this.userIdsPerClientId[clientId]) { this.userIdsPerClientId[clientId] = []; }
		this.userIdsPerClientId[clientId].push(userId);

		if (this.RTCClients[clientId]) { return; } // TODO Handle same user with many sessions
		const client = this.RTCClients[clientId] = new RTCClient(clientId, this.gatewayClient);
		this.setupClient(client);
		client.on('connect', (dc) => {
			const stream = dcstream(dc);
			stream.pipe(this.crdts[sessionId].createStream()).pipe(stream);
		});
	}

	private onSessionUser = (sessionId: string, clientId: string) => {
		if (!this.crdts[sessionId]) { this.createCRDT(sessionId); }

		if (this.RTCClients[clientId]) { return; } // TODO Handle same user with many sessions
		const client = this.RTCClients[clientId] = new RTCClient(clientId, this.gatewayClient);
		this.setupClient(client);
		client.initiateConnection();
		client.on('connect', (dc) => {
			this.executeAction(new SetUserConnected(this.userIdPerSessionId[sessionId], true));
			const stream = dcstream(dc);
			stream.pipe(this.crdts[sessionId].createStream()).pipe(stream);
		});
	}

	public createCRDT(sessionId: string, owner = false) {
		const crdt = this.crdts[sessionId] = new CRDTDoc();

		// TODO: how do we deal with the same user in different CRDTDOC ?
		const userId = 'user-' + uuid();
		this.userIdPerSessionId[sessionId] = userId;
		this.updating[userId] = true;
		const user = new User(this, crdt, userId, this.userName, owner);
		this.addDoc(user);
		delete this.updating[userId];

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
		client.on('disconnected', () => {
			const clientId = client.remoteClientId;
			const userIds = this.userIdsPerClientId[clientId] || [];
			userIds.forEach(userId => {
				this.executeAction(new SetUserConnected(userId, false));
			});
		});

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
		this.createCRDT(sessionId, true);
		this.gatewayClient.openSession(sessionId);
	}

	public closeSession(sessionId: string) {
		this.gatewayClient.closeSession(sessionId);
	}

	public join(sessionId: string) {
		this.createCRDT(sessionId);
		this.gatewayClient.joinSession(sessionId, this.userIdPerSessionId[sessionId]);
		return new Promise((resolve) => {
			// TODO handle error and reject ?
			const dispose = observe(this.sessionList, () => {
				if (this.sessionList.includes(sessionId)) {
					dispose();
					resolve();
				}
			});
		});
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
