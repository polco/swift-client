import * as debug from 'debug-logger';
import { EventEmitter } from 'events';
import * as SocketIO from 'socket.io-client';
const log = debug('swift:GatewayClient');

class GatewayClient<T> extends EventEmitter {
	private socket: SocketIOClient.Socket;

	constructor() {
		super();
		this.socket = SocketIO(__SOCKET_END_POINT__, { transports: ['websocket'], autoConnect: false });

		this.socket.on('data', ({ fromId, data }: { data: T, fromId: string }) => {
			log('received data', data);
			this.emit('message', fromId, data);
		});
		this.socket.on('error', (error: any) => log(error));
		this.socket.on('disconnect', () => {
			log(`${this.localId}: Disconnected from the gateway`);
			this.emit('disconnected');
		});
	}

	public connect(): Promise<void> {
		if (this.socket.connected) { return Promise.resolve(); }

		return new Promise((resolve, reject) => {
			this.socket.connect();

			this.socket.once('connect', () => {
				log(`${this.localId}: Connected to the gateway`);
				this.socket.removeListener('connect_error');
				this.socket.removeListener('connect_timeout');
				resolve();
			});
			this.socket.once('connect_error', reject);
			this.socket.once('connect_timeout', reject);
		});
	}

	get isConnected(): boolean { return this.socket.connected; }

	get localId(): string { return this.socket.id; }

	public disconnect() {
		if (!this.socket.connected) { return; }
		this.socket.disconnect();
		this.socket.removeListener('connect_error');
		this.socket.removeListener('connect_timeout');
	}

	public send(remoteId: string, data: T) {
		log('sending to', data, 'to', remoteId);
		this.socket.emit('data', {
			remoteId,
			data
		});
	}
}

export default GatewayClient;
