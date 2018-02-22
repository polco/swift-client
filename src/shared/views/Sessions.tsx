import { observer } from 'mobx-react';
import * as React from 'react';

import SessionItem from 'shared/components/SessionItem';
import { Context, contextTypes } from 'shared/context';

export type Props = {
	navigateToSession(sessionId: string): void
};

@observer
class Sessions extends React.Component<Props> {
	public context!: Context;
	public static contextTypes = contextTypes;

	private onEnterSession = (sessionId: string) => {
		//
	}

	public render() {
		const store = this.context.store;
		const sessionList = store.sessionList;

		return (
			<div className='Sessions'>
				{ sessionList.map(sessionId => <SessionItem
					sessionId={ sessionId }
					key={ sessionId }
					onEnterSession={ this.onEnterSession }
				/>) }
			</div>
		);
	}
}

export default Sessions;
