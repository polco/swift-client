import * as QRCode from 'qrcode.react';
import * as React from 'react';
import Button from 'shared/components/Button';
import RTCClient from 'shared/RTCClient';

export type Props = {
	client: RTCClient
};

type State = {
	sessionCreating: boolean,
	sessionId?: string
};

class SessionDisplay extends React.PureComponent<Props, State> {
	constructor(props: Props, context: any) {
		super(props, context);

		this.state = {
			sessionCreating: props.client.sessionCreating,
			sessionId: props.client.localId
		};
	}

	public componentWillMount() {
		this.props.client.on('sessionStarted', this.onSessionStarted);
		this.props.client.on('sessionEnd', this.onSessionStopped);
	}

	public componentWillUnmount() {
		this.props.client.removeListener('sessionStarted', this.onSessionStarted);
		this.props.client.removeListener('onSessionStopped', this.onSessionStarted);
	}

	private onSessionStarted = (sessionId: string) => {
		this.setState({ sessionId, sessionCreating: false });
	}

	private onSessionStopped = () => {
		this.setState({ sessionId: undefined, sessionCreating: false });
	}

	private createSession = () => {
		this.props.client.startSession();
		this.setState({ sessionCreating: true });
	}

	public render() {
		const { sessionId, sessionCreating } = this.state;

		return (
			<div className='session-display'>
				{ sessionCreating && 'Creating a session...' }
				{ sessionId ?
					<div className='session-display__qr-area'>
						<QRCode value={ sessionId } size={ 256 } />
						<div className='session-display__id'>{ 'id: ' + sessionId }</div>
					</div>
				: <Button onTap={ this.createSession }>Create Session</Button> }
			</div>
		);
	}
}

export default SessionDisplay;
