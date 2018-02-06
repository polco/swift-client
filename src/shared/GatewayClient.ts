import * as debug from 'debug-logger';
import { EventEmitter } from 'events';
import * as SocketIO from 'socket.io-client';
const log = debug('swift:GatewayClient');

class GatewayClient<T> extends EventEmitter {
	private socket: SocketIOClient.Socket;
	private isConnecting = false;

	constructor() {
		super();
		this.socket = SocketIO(__SOCKET_END_POINT__, { transports: ['websocket'], autoConnect: false });

		this.socket.on('data', (fromId: string, sessionId: string, data: T) => {
			log('received data', data);
			this.emit('message', fromId, data);
		});
		this.socket.on('error', (error: any) => log(error));
		this.socket.on('disconnect', () => {
			log(`Disconnected from the gateway`);
			this.emit('disconnected');
		});
	}

	public connect(): Promise<void> {
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

	public openSession(sessionId: string) {
		this.socket.emit('openSession', sessionId);
	}

	public closeSession(sessionId: string) {
		this.socket.emit('closeSession', sessionId);
	}

	get isConnected(): boolean { return this.socket.connected; }

	public disconnect() {
		if (!this.socket.connected) { return; }
		this.isConnecting = false;
		this.socket.disconnect();
		this.socket.removeListener('connect_error');
		this.socket.removeListener('connect_timeout');
	}

	public send(remoteId: string | null, sessionId: string, data: T) {
		log('sending', data, 'to', remoteId, 'for session', sessionId);
		this.socket.emit('data', remoteId, sessionId, data);
	}
}

export default GatewayClient;
