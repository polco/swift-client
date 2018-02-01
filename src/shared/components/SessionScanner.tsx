import * as debug from 'debug-logger';
import * as Instascan from 'instascan';
import * as React from 'react';
const log = debug('swift:SessionScanner');

export type Props = {
	onSessionScanned: (sessionId: string) => void
};

type State = {
	isScanning: boolean
};

class SessionDisplay extends React.PureComponent<Props, State> {
	private videoElt: HTMLVideoElement | null = null;
	private scanner: any;

	constructor (props: Props, context: any) {
		super(props, context);

		this.state = { isScanning: false };
	}

	public componentDidMount () {
		this.scanner = new Instascan.Scanner({ video: this.videoElt, mirror: false });
		this.scanner.addListener('scan', (content: string) => {
			this.scanner.stop();
			this.setState({ isScanning: false }, () => this.props.onSessionScanned(content));
		});
	}

	private scan = () => {
		this.setState({ isScanning: true }, () => {

			Instascan.Camera.getCameras().then((cameras: any[]) => {
				if (cameras.length > 0) {
					this.scanner.start(cameras[1] || cameras[0]);
				} else {
					this.setState({ isScanning: false });
					log('No cameras found.');
				}
			}).catch((e: any) => {
				this.setState({ isScanning: false });
				log(e);
			});
		});
	}

	private stopScanning = () => {
		this.scanner.stop();
	}

	public render () {
		const { isScanning } = this.state;

		return (
			<div className='session-scanner'>
				{ isScanning
					? <button onClick={ this.stopScanning }>Stop scanning</button>
					: <button onClick={ this.scan }>scan QR code</button>
				}
				<video ref={ ref => this.videoElt = ref } />
			</div>
		);
	}
}

export default SessionDisplay;
