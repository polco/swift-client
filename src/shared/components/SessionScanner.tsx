import * as QRScanner from 'qr-code-scanner';
import * as React from 'react';

export type Props = {
	onSessionScanned: (sessionId: string) => void
};

type State = {
	isScanning: boolean
};

class SessionDisplay extends React.PureComponent<Props, State> {
	private scannerDiv: HTMLDivElement | null;

	constructor(props: Props, context: any) {
		super(props, context);

		this.state = { isScanning: false };
	}

	private scan = () => {
		this.setState({ isScanning: true }, () => {
			QRScanner.initiate({
				onResult: (res: string) => {
					this.setState({ isScanning: false }, () => this.props.onSessionScanned(res));
				},
				onError: () => this.setState({ isScanning: false }),
				onTimeout: () => this.setState({ isScanning: false }),
				parent: this.scannerDiv
			});
		});
	}

	private stopScanning = () => {
		//
	}

	public render() {
		const { isScanning } = this.state;

		return (
			<div className='session-scanner'>
				{ isScanning
					? <button onClick={ this.stopScanning }>Stop scanning</button>
					: <button onClick={ this.scan }>scan QR code</button>
				}
				<div className='session-scanner__scanner-placeholder' ref={ ref => this.scannerDiv = ref } />
			</div>
		);
	}
}

export default SessionDisplay;
