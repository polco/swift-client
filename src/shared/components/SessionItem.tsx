import { observer } from 'mobx-react';
import * as QRCode from 'qrcode.react';
import * as React from 'react';

import Button from 'shared/components/Button';
import { Context, contextTypes } from 'shared/context';

export type Props = {
	sessionId: string,
	onEnterSession(sessionId: string): void
};

type State = {
	info: boolean
};

@observer
class SessionItem extends React.Component<Props, State> {
	public context!: Context;
	public static contextTypes = contextTypes;

	constructor(props: Props, context: Context) {
		super(props, context);

		this.state = { info: false };
	}

	private enterSession = () => {
		this.props.onEnterSession(this.props.sessionId);
	}

	private displayInfo = () => {
		this.setState({ info: !this.state.info });
	}

	public render() {
		const { sessionId } = this.props;
		const { info } = this.state;
		const session = this.context.store.getSession(sessionId);

		return (
			<Button className={ 'SessionItem' + (info ? ' SessionItem_info' : '') } onTap={ this.enterSession }>
				<div>{ session.name }</div>
				<Button onTap={ this.displayInfo }>Info</Button>
				{ info && (
					<div className='SessionItem__info'>
						<div className='user-select'>{ session.id }</div>
						<QRCode value={ session.id } size={ 256 } />
					</div>
				) }
			</Button>
		);
	}
}

export default SessionItem;
