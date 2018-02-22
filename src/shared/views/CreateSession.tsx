import * as React from 'react';
import * as uuid from 'uuid/v4';

import CreateSessionAction from 'shared/actions/CreateSession';

import Button from 'shared/components/Button';
import TextField from 'shared/components/TextField';
import { Context, contextTypes } from 'shared/context';

import './CreateSession.less';

export type Props = {
	navigateToSession(sessionId: string): void
};

class CreateSession extends React.PureComponent<Props> {
	public context!: Context;
	public static contextTypes = contextTypes;
	private sessionNameField!: TextField | null;

	private createSession = () => {
		const sessionId = 'session-' + uuid();
		const store = this.context.store;
		store.executeAction(new CreateSessionAction(
			sessionId,
			this.sessionNameField!.getValue(),
			store.userId
		));
		store.openSession(sessionId);
		this.props.navigateToSession(sessionId);
	}

	public render() {
		return (
			<div className='CreateSession'>
				<div className='view__explanation'>Create a session to allow another device to connect.</div>
				<div className='view__box'>
					<div className='view__column'>
						<TextField
							label='choose a name for your session'
							placeholder='My session'
							ref={ ref => this.sessionNameField = ref }
						/>
					</div>
					<div className='view__column CreateSession__create-column'>
						<Button className='action-button  CreateSession__Create' onTap={ this.createSession }>
							Create
						</Button>
					</div>
				</div>
			</div>
		);
	}
}

export default CreateSession;
