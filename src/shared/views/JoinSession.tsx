import * as React from 'react';
import Button from 'shared/components/Button';
import SessionScanner from 'shared/components/SessionScanner';
import TextField from 'shared/components/TextField';
import { Context, contextTypes } from 'shared/context';

import CreateSessionAction from 'shared/actions/CreateSession';

import './JoinSession.less';

type Props = {};

type State = {
	isScanning: boolean
};

class JoinSession extends React.PureComponent<Props, State> {
	public context!: Context;
	public static contextTypes = contextTypes;
	private userNameField: TextField | null = null;
	private scanner: SessionScanner | null = null;
	private input: HTMLInputElement | null = null;

	constructor(props: Props, context: Context) {
		super(props, context);

		this.state = {
			isScanning: false
		};
	}

	private onSessionScanned = (sessionId: string) => {
		this.joinSession(sessionId);
	}

	private stopScanning = () => {
		this.setState({ isScanning: false }, () => this.scanner!.stop());
	}

	private startScanning = () => {
		try {
			this.scanner!.scan();
			this.setState({ isScanning: true });
		} catch {
			//
		}
	}

	private validateSession = () => {
		const sessionId = this.input!.value;
		this.joinSession(sessionId);
	}

	private joinSession(sessionId: string) {
		this.context.store.executeAction(new CreateSessionAction(
			sessionId,
			'',
			this.userNameField!.getValue()
		));
		this.context.RTCClient.joinSession(sessionId);
	}

	public render() {
		const { isScanning } = this.state;

		return (
			<div className={ 'JoinSession' + (isScanning ? ' JoinSession_scanning' : '') }>
				<div className='view__explanation'>Join an existing session by scanning its QR code or entering its ID.</div>
				<div className='view__box'>
					<TextField
						label='choose a name to identify yourself'
						placeholder='Albert'
						ref={ ref => this.userNameField = ref }
					/>
				</div>
				<div className='view__box'>
					<div className='view__header'>Scan a QR Code</div>
					<Button onTap={ this.startScanning } className='action-button'>Start Scanning</Button>
					<div className='JoinSession__scanner'>
						<SessionScanner onSessionScanned={ this.onSessionScanned } ref={ ref => this.scanner = ref } />
						<Button onTap={ this.stopScanning } className='action-button JoinSession__StopScanning'>Stop Scanning</Button>
					</div>
				</div>
				<div className='view__box'>
					<div className='view__header'>Enter a session ID</div>
					<input className='JoinSession__id-input' ref={ ref => this.input = ref } />
					<Button onTap={ this.validateSession } className='action-button'>Join</Button>
				</div>
			</div>
		);
	}
}

export default JoinSession;
