import * as debug from 'debug-logger';
import { EventEmitter } from 'events';
import * as SocketIO from 'socket.io-client';
const log = debug('swift:GatewayClient');

class GatewayClient extends EventEmitter {
	private socket: SocketIOClient.Socket;
	private isConnecting = false;
	// private socketIdPerUserId: {[userId: string]: string} = {};

	constructor() {
		super();
		this.socket = SocketIO(__SOCKET_END_POINT__, { transports: ['websocket'], autoConnect: false });

		this.socket.on('data', (clientId: string, data: any) => {
			log('received data', data);
			this.emit('data', clientId, data);
		});
		this.socket.on('error', (error: any) => log(error));
		this.socket.on('disconnect', () => {
			log(`Disconnected from the gateway`);
			this.emit('disconnected');
		});
		this.socket.on('join', (sessionId: string, clientId: string, userId: string) => {
			this.emit('join', sessionId, clientId, userId);
		});
		this.socket.on('sessionClient', (sessionId: string, clientId: string) => {
			this.emit('sessionClient', sessionId, clientId);
		});
	}

	private connect(): Promise<void> {
		if (this.isConnecting || this.socket.connected) { return Promise.resolve(); }
		this.isConnecting = true;

		return new Promise((resolve, reject) => {
			this.socket.connect();

			this.socket.once('connect', () => {
				this.isConnecting = false;
				log(`Connected to the gateway`);
				this.socket.removeListener('connect_error');
				this.socket.removeListener('connect_timeout');
				resolve();
			});
			this.socket.once('connect_error', reject);
			this.socket.once('connect_timeout', reject);
		});
	}

	public async openSession(sessionId: string) {
		if (!this.socket.connected) { await this.connect(); }
		this.socket.emit('openSession', sessionId);
	}

	public async closeSession(sessionId: string) {
		if (!this.socket.connected) { await this.connect(); }
		this.socket.emit('closeSession', sessionId);
		this.disconnect();
	}

	public async joinSession(sessionId: string, userId: string) {
		if (!this.socket.connected) { await this.connect(); }
		this.socket.emit('join', sessionId, userId);
	}

	private disconnect() {
		if (!this.socket.connected) { return; }
		this.isConnecting = false;
		this.socket.disconnect();
		this.socket.removeListener('connect_error');
		this.socket.removeListener('connect_timeout');
	}

	public async send(remoteClientId: string, data: any) {
		if (!this.socket.connected) { await this.connect(); }
		log('sending', data, 'to', remoteClientId);
		this.socket.emit('data', remoteClientId, data);
	}
}

export default GatewayClient;
