import { observer } from 'mobx-react';
import * as React from 'react';

import Button from 'shared/components/Button';
import { Context, contextTypes } from 'shared/context';

import './SessionItem.less';

export type Props = {
	sessionId: string,
	onEnterSession(sessionId: string): void
};

@observer
class SessionItem extends React.Component<Props> {
	public context!: Context;
	public static contextTypes = contextTypes;

	private enterSession = () => {
		this.props.onEnterSession(this.props.sessionId);
	}

	public render() {
		const { sessionId } = this.props;
		const store = this.context.store;
		const session = store.getSession(sessionId);

		const count = session.itemIds.length;

		return (
			<Button className='SessionItem' onTap={ this.enterSession }>
				<div className='SessionItem__session-info'>
					<div className='SessionItem__session-name'>{ session.name }</div>
					<div className='SessionItem__item-count'>{ `${count} item${ count > 1 ? 's' : '' }` }</div>
				</div>
				<div className='SessionItem__client-list'>
					<div className='SessionItem__client-list-label'>Connected clients:</div>
					{ session.userIds.map(userId => {
						const isYou = userId === store.userIdPerSessionId[sessionId];
						return (
							<div
								className={ 'SessionItem__client' + (isYou ? ' SessionItem__client_you' : '') }
								key={ userId }
							>
								{ store.getUser(userId).name }
								{ isYou ? ' (you)' : null }
							</div>
						);
					}) }
				</div>
			</Button>
		);
	}
}

export default SessionItem;
