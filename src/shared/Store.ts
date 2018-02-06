import * as debug from 'debug-logger';
import { IObjectChange, observable, observe } from 'mobx';
import * as uuid from 'uuid/v4';

import GatewayClient from 'shared/GatewayClient';

import Doc from 'shared/models/Doc';

import AddSession from 'shared/actions/AddSession';
import AddSessionUser from 'shared/actions/AddSessionUser';
import UpdateUserName from 'shared/actions/UpdateUserName';

import Action from 'shared/actions/Action';
import Session from 'shared/models/Session';
import User from 'shared/models/User';
import DocsUpdate from './actions/DocsUpdate';
import RTCClient from './RTCClient';

const log = debug('swift:RTCClient');

class Store {
	@observable public sessionList: string[] = [];
	private docs: {[docId: string]: Doc} = {};
	public user: User;
	private gatewayClient: GatewayClient;
	private RTCClients: {[userId: string]: RTCClient} = {};

	constructor() {
		(window as any).store = this;
		(window as any).test = (name: string) => {
			this.executeAction(new UpdateUserName(this.user.id, name));
		};

		this.user = new User('user-' + uuid(), 'user');
		this.addDoc(this.user);

		this.gatewayClient = new GatewayClient(this.user.id);
		this.gatewayClient.on('join', this.onJoin);
		this.gatewayClient.on('sessionUser', this.onSessionUser);
	}

	public getDoc(docId: string): Doc {
		return this.docs[docId];
	}

	public addDoc(doc: Doc) {
		this.docs[doc.id] = doc;
		doc.disposeObserver = observe(doc, this.onDocChange);
	}

	private onJoin = (sessionId: string, userId: string) => {
		if (this.RTCClients[userId]) { return; } // just update the session object
		const client = this.RTCClients[userId] = new RTCClient(userId, this.gatewayClient);
		this.setupClient(client);
		client.on('connect', () => {
			this.executeAction(new AddSessionUser(sessionId, userId));
			client.sendMessage('get-docs', [userId]);
		});
	}

	private onSessionUser = (sessionId: string, userId: string) => {
		if (this.RTCClients[userId]) { return; }
		const client = this.RTCClients[userId] = new RTCClient(userId, this.gatewayClient);
		this.setupClient(client);
		client.initiateConnection();
		client.on('connect', () => {
			this.executeAction(new AddSession(sessionId, userId));
			client.sendMessage('get-docs', [sessionId, userId]);
		});
	}

	private setupClient(client: RTCClient) {
		client.on('get-docs', (docIds: string[]) => {
			client.sendMessage('docs', docIds.map(docId => this.docs[docId].toModel()));
		});

		client.on('docs', (objects: any[]) => {
			this.executeAction(new DocsUpdate(objects));
		});
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

	private onDocChange = (change: IObjectChange) => {
		// TODO implement the logic to update clients with those new data
	}

	public getSession(sessionId: string): Session {
		return this.docs[sessionId] as Session;
	}

	public removeSession(sessionId: string) {
		const session = this.docs[sessionId] as Session;
		if (!session) { return log('trying to remove an inexisting session', sessionId); }
		session.disposeObserver();
		delete this.docs[sessionId];
	}

	public getUser(userId: string): User {
		return this.docs[userId] as User;
	}

	public executeAction<A extends Action>(action: A): A {
		action.run(this);
		return action;
	}
}

export default Store;
