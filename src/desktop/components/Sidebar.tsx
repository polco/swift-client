import { observer } from 'mobx-react';
import * as React from 'react';

import Button from 'shared/components/Button';
import { Context, contextTypes } from 'shared/context';

import './Sidebar.less';

export type Props = {
	selectSession(sesionId: string): void,
	sessionId: string | null
};

@observer
class Sidebar extends React.Component<Props> {
	public context!: Context;
	public static contextTypes = contextTypes;

	private onSessionSelect = (e: Button<{ sessionId: string }>) => {
		this.props.selectSession(e.props.sessionId);
	}

	public render() {
		const store = this.context.store;
		const currentSessionId = this.props.sessionId;

		return (
			<div className='Sidebar'>
				<div className='Sidebar__user'>
					<div className='Sidebar__label'>
						Client name:
					</div>
					<div className='Sidebar__user-name'>
						{ store.userName }
					</div>
				</div>
				{ store.sessionList.length ?
					<div className='Sidebar__sessions'>
						<div className='Sidebar__label'>
							Sessions:
						</div>
						<div className='Sidebar__session-list'>
						{
							store.sessionList.map(sessionId => {
								const session = store.getSession(sessionId);

								return (
									<Button
										key={ sessionId }
										sessionId={ sessionId }
										onTap={ this.onSessionSelect }
										className={ 'Sidebar__session' + (currentSessionId === sessionId ? ' Sidebar__session_active' : '') }
									>
										{ session.name }
									</Button>
								);
							})
						}
						</div>
					</div>
				: null }
			</div>
		);
	}
}

export default Sidebar;
