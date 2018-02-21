import { Doc as CRDTDoc } from 'crdt';
import * as debug from 'debug-logger';
import { IObjectChange, observable } from 'mobx';
import * as dcstream from 'rtc-dcstream';
import * as uuid from 'uuid/v4';

import GatewayClient from 'shared/GatewayClient';

import Doc from 'shared/models/Doc';

import Action from 'shared/actions/Action';
import AddSessionUser from 'shared/actions/AddSessionUser';
import CreateSession from 'shared/actions/CreateSession';
import CreateUser from 'shared/actions/CreateUser';
import UpdateSessionName from 'shared/actions/UpdateSessionName';
import UpdateUserName from 'shared/actions/UpdateUserName';

import Session from 'shared/models/Session';
import User from 'shared/models/User';
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
	public user: User;
	private gatewayClient: GatewayClient;
	private RTCClients: { [userId: string]: RTCClient } = {};
	// private docChanges: { [docId: string]: DocChange[] } = {};

	public userCRDT = new CRDTDoc();
	public creating: {[id: string]: true} = {};

	constructor() {
		(window as any).store = this;
		(window as any).udpateUser = (name: string) => {
			this.executeAction(new UpdateUserName(this.user.id, name));
		};
		(window as any).udpateSession = (name: string) => {
			const sessionId = this.sessionList[0];
			this.executeAction(new UpdateSessionName(sessionId, name));
		};

		// this.userCRDT.on('row_update', (row) => {
		// 	console.log(row);
		// });

		this.userCRDT.on('update', (update, source) => {
			console.log('userCRDT update', update, source);  // tslint:disable-line
		});

		this.userCRDT.on('create', (row) => {
			const id = row.get('id');
			if (!this.docs[id] && !this.creating[id]) {
				this.creating[id] = true;
				if (row.get('type') === 'session') {
					this.executeAction(new CreateSession(id, row.get('name'), row.get('ownerId')));
				} else {
					this.executeAction(new CreateUser(id, row.get('name')));
				}
				delete this.creating[id];
			}
		});

		const userId = 'user-' + uuid();
		this.creating[userId] = true;
		this.user = new User(this.userCRDT, userId, 'user');
		this.addDoc(this.user);
		delete this.creating[userId];

		this.gatewayClient = new GatewayClient(this.user.id);
		this.gatewayClient.on('join', this.onJoin);
		this.gatewayClient.on('sessionUser', this.onSessionUser);
	}

	public getDoc(docId: string): Doc {
		return this.docs[docId];
	}

	public addDoc(doc: Doc) {
		this.docs[doc.id] = doc;
	}

	private onJoin = (sessionId: string, userId: string) => {
		if (this.RTCClients[userId]) { return; } // just update the session object
		const client = this.RTCClients[userId] = new RTCClient(userId, this.gatewayClient);
		this.setupClient(client);
		client.on('connect', (dc) => {
			const stream = dcstream(dc);
			stream.pipe(this.userCRDT.createStream()).pipe(stream);
			// const session = this.getSession(sessionId);
			// stream.pipe(session.crdt.createStream()).pipe(stream);
			this.executeAction(new AddSessionUser(sessionId, userId));
			// client.sendMessage('get-docs', [userId]);
		});
	}

	private onSessionUser = (sessionId: string, userId: string) => {
		if (this.RTCClients[userId]) { return; }
		const client = this.RTCClients[userId] = new RTCClient(userId, this.gatewayClient);
		this.setupClient(client);
		client.initiateConnection();
		client.on('connect', (dc) => {
			const stream = dcstream(dc);
			stream.pipe(this.userCRDT.createStream()).pipe(stream);
			// this.executeAction(new CreateSession(sessionId, '', userId));
			// const session = this.getSession(sessionId);
			// stream.pipe(session.crdt.createStream()).pipe(stream);
			// client.sendMessage('get-docs', [sessionId, userId]);
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
		this.gatewayClient.joinSession(sessionId);
	}

	// private onDocChange = (change: IObjectChange) => {
	// 	const docId = change.object.id;
	// 	if (!this.docChanges[docId]) { this.docChanges[docId] = []; }
	// 	this.docChanges[docId].push({
	// 		type: change.type,
	// 		name: change.name,
	// 		newValue: change.newValue,
	// 		docId
	// 	});
	// }

	public getSession(sessionId: string): Session {
		return this.docs[sessionId] as Session;
	}

	public removeSession(sessionId: string) {
		const session = this.docs[sessionId] as Session;
		if (!session) { return log('trying to remove an inexisting session', sessionId); }
		// session.disposeObserver();
		delete this.docs[sessionId];
	}

	public getUser(userId: string): User {
		return this.docs[userId] as User;
	}

	public executeAction<A extends Action>(action: A, sideEffect = false): A {
		// this.docChanges = {};
		action.run(this);
		// if (!sideEffect) {
		// 	const changePerSession: { [sessionId: string]: { [docId: string]: DocChange[] } } = {};

		// 	for (const docId in this.docChanges) {
		// 		const changes = this.docChanges[docId];
		// 		const sessionIds = this.docs[docId].belongToSessions(this);
		// 		for (const sessionId of sessionIds) {
		// 			if (!changePerSession[sessionId]) { changePerSession[sessionId] = {}; }
		// 			changePerSession[sessionId][docId] = changes;
		// 		}
		// 	}

		// 	for (const sessionId in changePerSession) {
		// 		const docChanges = changePerSession[sessionId];
		// 		const session = this.docs[sessionId] as Session;

		// 		// TODO stringify once the changes
		// 		const change = { sessionId, changes: docChanges };

		// 		if (session.ownerId === this.user.id) {
		// 			for (const userId of session.userIds) {
		// 				this.RTCClients[userId].sendMessage('doc-changes', change);
		// 			}
		// 		} else {
		// 			this.RTCClients[session.ownerId].sendMessage('doc-changes', change);
		// 		}
		// 	}
		// }
		return action;
	}
}

export default Store;
