import * as React from 'react';
import SessionDisplay from 'shared/components/SessionDisplay';
import SessionScanner from 'shared/components/SessionScanner';
import RTCClient from 'shared/RTCClient';

export type Props = {};

type State = {};

class Home extends React.PureComponent<Props, State> {
	private client: RTCClient;

	constructor(props: Props, context: any) {
		super(props, context);

		this.client = new RTCClient();
	}

	private onSessionScanned(sessionId: string) {
		this.client.connectTo(sessionId);
	}

	public render() {
		return (
			<div className='home'>
				<SessionDisplay client={ this.client } />
				<SessionScanner onSessionScanned={ this.onSessionScanned } />
			</div>
		);
	}
}

export default Home;
