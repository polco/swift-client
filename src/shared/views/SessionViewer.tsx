import * as React from 'react';

import Button from 'shared/components/Button';
import SessionDisplay from 'shared/components/SessionDisplay';
import SessionInfo from 'shared/components/SessionInfo';

import './SessionViewer.less';

export type Props = {
	sessionId: string,
	openInfo: boolean,
	goBack?(): void
};

type State = {
	infoOpen: boolean
};

class SessionViewer extends React.Component<Props, State> {
	constructor(props: Props, context: any) {
		super(props, context);

		this.state = { infoOpen: props.openInfo };
	}

	public componentWillReceiveProps(nextProps: Props) {
		if (nextProps.openInfo && !this.state.infoOpen) {
			this.setState({ infoOpen: true });
		}
	}

	private toggleInfo = () => {
		this.setState({ infoOpen: !this.state.infoOpen });
	}

	public render() {
		const sessionId = this.props.sessionId;
		const infoOpen = this.state.infoOpen;

		return (
			<div className='SessionViewer'>
				<div className='SessionViewer__header'>
					<Button onTap={ this.toggleInfo } className='SessionViewer__info'>Info</Button>
					<Button onTap={ this.props.goBack } className='SessionViewer__go-back'>Go back</Button>
					<div
						className={ 'SessionViewer__slider-container' + (infoOpen ? '' : ' SessionViewer__slider-container_close') }
					>
						<div className='SessionViewer__slider'>
							<SessionInfo sessionId={ sessionId } />
						</div>
					</div>
				</div>
				<SessionDisplay sessionId={ sessionId } />
			</div>
		);
	}
}

export default SessionViewer;
