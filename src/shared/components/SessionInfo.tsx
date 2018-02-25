import { observer } from 'mobx-react';
import * as QRCode from 'qrcode.react';
import * as React from 'react';
import { Context, contextTypes } from 'shared/context';

import './SessionInfo.less';

export type Props = {
	sessionId: string
};

@observer
class SessionInfo extends React.Component<Props> {
	public context!: Context;
	public static contextTypes = contextTypes;

	public render() {
		const store = this.context.store;
		const session = store.getSession(this.props.sessionId);

		return (
			<div className='SessionInfo'>
				<div className='SessionInfo__details'>
					<div className='SessionInfo__box'>
						<div className='SessionInfo__label'>Name:</div>
						<div className='SessionInfo__name'>{ session.name }</div>
					</div>
					<div className='SessionInfo__box'>
						<div className='SessionInfo__label'>Created by:</div>
						<div className='SessionInfo__creator'>{ store.getUser(session.ownerId).name }</div>
					</div>
					<div className='SessionInfo__box'>
						<div className='SessionInfo__label'>Id:</div>
						<div className='SessionInfo__creator'>{ session.id }</div>
					</div>
				</div>
				<div className='SessionInfo__QR'>
					<QRCode value={ session.id } size={ 256 } />
				</div>
			</div>
		);
	}
}

export default SessionInfo;
