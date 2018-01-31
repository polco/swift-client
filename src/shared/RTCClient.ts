import * as debug from 'debug-logger';
import { EventEmitter } from 'events';
import GatewayClient from 'shared/GatewayClient';
const log = debug('swift:RTCClient');

type Message =
	{ type: 'offer', sessionDescription: RTCSessionDescriptionInit } |
	{ type: 'answer', sessionDescription: RTCSessionDescriptionInit } |
	{ type: 'candidate', candidate: RTCIceCandidateInit };

class RTCClient extends EventEmitter {
	private pc: RTCPeerConnection;
	// private remoteConnection: RTCPeerConnection;
	private sendChannel: RTCDataChannel;
	private gatewayClient: GatewayClient<Message>;
	private remoteId: string;
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

		try {
			this.pc = new RTCPeerConnection({
				iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
			});
			this.pc.onicecandidate = this.onLocalIceCandidate;
			this.pc.ondatachannel = this.onDataChannel;

			this.sendChannel = this.pc.createDataChannel('Swift Data Channel');
			this.sendChannel.onopen = this.onSendChannelOpen;
			this.sendChannel.onclose = this.onSendChannelClose;
		} catch (error) {
			log(error);
		}
	}

	get localId(): string { return this.gatewayClient.localId; }

	public async startSession() {
		if (this.sessionCreating) { return; }
		this.sessionCreating = true;
		await this.gatewayClient.connect();
		this.sessionCreating = false;
		this.sessionCreated = true;
		this.emit('sessionStarted', this.gatewayClient.localId);
	}

	public async connectTo(remoteId: string) {
		log('connectTo', remoteId);
		if (this.gatewayClient.isConnected) {
			await this.gatewayClient.connect();
		}
		this.remoteId = remoteId;
		log('create offer');
		const sessionDescription = await this.pc.createOffer() as any;
		log('offer created');
		await this.pc.setLocalDescription(sessionDescription);
		log('sending session desciption', sessionDescription);
		this.gatewayClient.send(remoteId, { type: 'offer', sessionDescription });
	}

	private onGatewayMessage = async (fromId: string, msg: Message) => {
		this.remoteId = fromId;
		log('received message', msg);
		if (msg.type === 'offer') {
			this.pc.setRemoteDescription(new RTCSessionDescription(msg.sessionDescription));
			const sessionDescription = await this.pc.createAnswer() as any;
			this.pc.setLocalDescription(sessionDescription);
			this.gatewayClient.send(fromId, { type: 'answer', sessionDescription });
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
	}

	private onSendChannelClose = (e: Event) => {
		log('onSendChannelClose', e);
	}

	private onDataChannel = (e: RTCDataChannelEvent) => {
		log('data channel opened');
		this.sendChannel = e.channel;
		this.setupDataChannel();
	}

	private setupDataChannel() {
		(window as any).sendMessage = (data: any) => {
			this.sendChannel.send(JSON.stringify(data));
		};

		this.sendChannel.onmessage = (event) => {
			console.log(JSON.parse(event.data)); // tslint:disable-line
		};
	}

	private onLocalIceCandidate = (e: RTCPeerConnectionIceEvent) => {
		if (!e.candidate) { return; }

		this.gatewayClient.send(this.remoteId, {
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
