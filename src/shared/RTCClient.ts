import * as debug from 'debug-logger';
import { EventEmitter } from 'events';
import GatewayClient from 'shared/GatewayClient';
const log = debug('swift:RTCClient');

type Message =
	{ type: 'client', sessionId: string } |
	{ type: 'offer', sessionDescription: RTCSessionDescriptionInit } |
	{ type: 'answer', sessionDescription: RTCSessionDescriptionInit } |
	{ type: 'candidate', candidate: RTCIceCandidateInit };

class RTCClient extends EventEmitter {
	private pc: RTCPeerConnection;
	// private remoteConnection: RTCPeerConnection;
	private sendChannel: RTCDataChannel | null = null;
	private gatewayClient: GatewayClient<Message>;
	private currentRemoteId: string = '';
	public sessionId = '';
	public sessionCreating = false;
	public sessionCreated = false;

	constructor() {
		super();
		this.gatewayClient = new GatewayClient();
		this.gatewayClient.on('message', this.onGatewayMessage);
		this.gatewayClient.on('disconnected', () => {
			this.sessionCreating = false;
			if (this.sessionCreated) {
				this.sessionCreated = false;
				this.emit('sessionStopped');
			}
		});

		this.pc = new RTCPeerConnection({
			iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
		});
		this.pc.onicecandidate = this.onLocalIceCandidate;
		this.pc.ondatachannel = this.onDataChannel;
	}

	public async openSession(sessionId: string) {
		if (this.sessionCreating) { return; }
		this.sessionId = sessionId;
		this.sessionCreating = true;
		await this.gatewayClient.connect();
		this.gatewayClient.openSession(sessionId);
		this.sessionCreating = false;
		this.sessionCreated = true;
		this.emit('sessionOpened', sessionId);
	}

	public async closeSession() {
		if (!this.sessionCreated) { return; }
		this.sessionCreated = false;
		this.gatewayClient.closeSession(this.sessionId);
		this.emit('sessionClosed', this.sessionId);
	}

	public async joinSession(sessionId: string) {
		log('joinSession', sessionId);
		if (!this.gatewayClient.isConnected) {
			try {
				await this.gatewayClient.connect();
			} catch (e) {
				log('Connection error', e);
			}
		}
		this.sendChannel = this.pc.createDataChannel('Swift Data Channel');
		this.sendChannel.onopen = this.onSendChannelOpen;
		this.sendChannel.onclose = this.onSendChannelClose;

		this.sessionId = sessionId;
		log('create offer');
		const sessionDescription = await this.pc.createOffer() as any;
		log('offer created');
		await this.pc.setLocalDescription(sessionDescription);
		this.gatewayClient.send(null, sessionId, { type: 'offer', sessionDescription });
	}

	private onGatewayMessage = async (fromId: string, msg: Message) => {
		if (msg.type === 'offer') {
			this.currentRemoteId = fromId;
			this.pc.setRemoteDescription(new RTCSessionDescription(msg.sessionDescription));
			const sessionDescription = await this.pc.createAnswer() as any;
			this.pc.setLocalDescription(sessionDescription);
			this.gatewayClient.send(fromId, this.sessionId, { type: 'answer', sessionDescription });
		} else if (msg.type === 'answer') {
			this.pc.setRemoteDescription(msg.sessionDescription);
		} else if (msg.type === 'candidate') {
			const candidate = new RTCIceCandidate({
				sdpMLineIndex: msg.candidate.sdpMLineIndex,
				candidate: msg.candidate.candidate
			});
			this.pc.addIceCandidate(candidate);
		}
	}

	private onSendChannelOpen = (e: Event) => {
		log('data channel opened');
		this.setupDataChannel();
		this.gatewayClient.disconnect();
	}

	private onSendChannelClose = (e: Event) => {
		log('onSendChannelClose', e);
	}

	private onDataChannel = (e: RTCDataChannelEvent) => {
		log('data channel opened');
		this.sendChannel = e.channel;
		this.setupDataChannel();
		this.gatewayClient.closeSession(this.sessionId);
		this.gatewayClient.disconnect();
	}

	private setupDataChannel() {
		(window as any).sendMessage = (data: any) => {
			this.sendChannel!.send(JSON.stringify(data));
		};

		this.sendChannel!.onmessage = (event) => {
			console.log(JSON.parse(event.data)); // tslint:disable-line
		};
	}

	private onLocalIceCandidate = (e: RTCPeerConnectionIceEvent) => {
		if (!e.candidate) { return; }

		this.gatewayClient.send(this.currentRemoteId, this.sessionId, {
			type: 'candidate',
			candidate: {
				sdpMLineIndex: e.candidate.sdpMLineIndex,
				sdpMid: e.candidate.sdpMid,
				candidate: e.candidate.candidate
			} as RTCIceCandidateInit
		});
	}
}

export default RTCClient;
