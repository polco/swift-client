import * as debug from 'debug-logger';
import * as Instascan from 'instascan';
import * as React from 'react';
const log = debug('swift:SessionScanner');

export type Props = {
	onSessionScanned: (sessionId: string) => void
};

class SessionScanner extends React.PureComponent<Props> {
	private videoElt: HTMLVideoElement | null = null;
	private scanner: any;

	public componentDidMount () {
		this.scanner = new Instascan.Scanner({ video: this.videoElt, mirror: false });
		this.scanner.addListener('scan', (content: string) => {
			this.scanner.stop();
			this.props.onSessionScanned(content);
		});
	}

	public scan = (): Promise<void> => {
		return Instascan.Camera.getCameras().then((cameras: any[]) => {
			if (cameras.length > 0) {
				this.scanner.start(cameras[1] || cameras[0]);
			} else {
				log('No cameras found.');
				throw new Error('No cameras found.');
			}
		});
	}

	public stop = () => {
		this.scanner.stop();
	}

	public render () {
		return (
			<video ref={ ref => this.videoElt = ref } className='session-scanner' />
		);
	}
}

export default SessionScanner;
