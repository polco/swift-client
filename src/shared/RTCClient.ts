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
	private gatewayClient: GatewayClient;
	private sendChannel: RTCDataChannel | null = null;
	private remoteUserId: string;
	public sessionCreating = false;
	public sessionCreated = false;

	constructor(remoteUserId: string, gatewayClient: GatewayClient) {
		super();

		this.gatewayClient = gatewayClient;
		this.gatewayClient.on('data', this.onGatewayMessage);
		this.remoteUserId = remoteUserId;

		this.pc = new RTCPeerConnection({
			iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
		});
		this.pc.onicecandidate = this.onLocalIceCandidate;
		this.pc.ondatachannel = this.onDataChannel;
	}

	public async initiateConnection() {
		log('initiateConnection');
		this.sendChannel = this.pc.createDataChannel('Swift Data Channel with ' + this.remoteUserId);
		this.sendChannel.onopen = this.onSendChannelOpen;
		this.sendChannel.onclose = this.onSendChannelClose;
		this.sendChannel.onerror = this.onSendChannelError;

		log('create offer');
		const sessionDescription = await this.pc.createOffer() as any;
		log('offer created');
		await this.pc.setLocalDescription(sessionDescription);
		this.gatewayClient.send(this.remoteUserId, { type: 'offer', sessionDescription });
	}

	public onGatewayMessage = async (fromUserId: string, msg: Message) => {
		if (fromUserId !== this.remoteUserId) { return; }
		if (msg.type === 'offer') {
			this.pc.setRemoteDescription(new RTCSessionDescription(msg.sessionDescription));
			const sessionDescription = await this.pc.createAnswer() as any;
			this.pc.setLocalDescription(sessionDescription);
			this.gatewayClient.send(this.remoteUserId, { type: 'answer', sessionDescription });
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

	private onSendChannelError = (e: ErrorEvent) => {
		log('onSendChannelError', e);
	}

	private onDataChannel = (e: RTCDataChannelEvent) => {
		log('data channel opened');
		this.sendChannel = e.channel;
		this.setupDataChannel();
	}

	private setupDataChannel() {
		this.sendChannel!.onmessage = (event) => {
			const { type, data } = JSON.parse(event.data);
			this.emit(type, data);
		};
		this.gatewayClient.removeListener('data', this.onGatewayMessage);
		this.emit('connect');
	}

	public sendMessage(type: string, data: any) {
		if (this.sendChannel) {
			this.sendChannel.send(JSON.stringify({ type, data }));
		} else {
			log('trying to send a message before the channel is opened');
		}
	}

	private onLocalIceCandidate = (e: RTCPeerConnectionIceEvent) => {
		if (!e.candidate) { return; }

		this.gatewayClient.send(this.remoteUserId, {
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
