import * as debug from 'debug-logger';
import { EventEmitter } from 'events';
import * as SocketIO from 'socket.io-client';
const log = debug('swift:GatewayClient');

class GatewayClient extends EventEmitter {
	private socket: SocketIOClient.Socket;
	private isConnecting = false;

	constructor(userId: string) {
		super();
		this.socket = SocketIO(__SOCKET_END_POINT__, { transports: ['websocket'], autoConnect: false, query: { userId } });

		this.socket.on('data', (fromId: string, data: any) => {
			log('received data', data);
			this.emit('data', fromId, data);
		});
		this.socket.on('error', (error: any) => log(error));
		this.socket.on('disconnect', () => {
			log(`Disconnected from the gateway`);
			this.emit('disconnected');
		});
		this.socket.on('join', (sessionId: string, remoteUserId: string) => {
			this.emit('join', sessionId, remoteUserId);
		});
		this.socket.on('sessionUser', (sessionId: string, remoteUserId: string) => {
			this.emit('sessionUser', sessionId, remoteUserId);
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

	public async joinSession(sessionId: string) {
		if (!this.socket.connected) { await this.connect(); }
		this.socket.emit('join', sessionId);
	}

	private disconnect() {
		if (!this.socket.connected) { return; }
		this.isConnecting = false;
		this.socket.disconnect();
		this.socket.removeListener('connect_error');
		this.socket.removeListener('connect_timeout');
	}

	public async send(remoteUserId: string, data: any) {
		if (!this.socket.connected) { await this.connect(); }
		log('sending', data, 'to', remoteUserId);
		this.socket.emit('data', remoteUserId, data);
	}
}

export default GatewayClient;
