import * as React from 'react';
import Button from 'shared/components/Button';
import SessionDisplay from 'shared/components/SessionDisplay';
import SessionScanner from 'shared/components/SessionScanner';
import RTCClient from 'shared/RTCClient';
import './Home.less';

export type Props = {};

type State = {};

class Home extends React.PureComponent<Props, State> {
	private client: RTCClient;

	constructor(props: Props, context: any) {
		super(props, context);

		this.client = new RTCClient();
	}

	private onSessionScanned = (sessionId: string) => {
		this.client.connectTo(sessionId);
	}

	public render() {
		return (
			<div className='home'>
				<SessionDisplay client={ this.client } />
				<SessionScanner onSessionScanned={ this.onSessionScanned } />
				<Button />
			</div>
		);
	}
}

export default Home;
