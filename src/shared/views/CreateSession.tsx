import * as React from 'react';
import * as uuid from 'uuid/v4';

import CreateSessionAction from 'shared/actions/CreateSession';

import Button from 'shared/components/Button';
import TextField from 'shared/components/TextField';
import { Context, contextTypes } from 'shared/context';
import { TabComponentProps } from 'shared/views/tabs';

import './CreateSession.less';

class CreateSession extends React.PureComponent<TabComponentProps> {
	public context!: Context;
	public static contextTypes = contextTypes;
	private sessionNameField!: TextField | null;

	private createSession = () => {
		const value = this.sessionNameField!.getValue();
		if (value === '') { return; }

		const sessionId = 'session-' + uuid();
		const store = this.context.store;
		store.openSession(sessionId);
		store.executeAction(new CreateSessionAction(
			sessionId,
			value,
			store.userIdPerSessionId[sessionId]
		));
		this.props.navigateToSession(sessionId);
	}

	public render() {
		return (
			<div className='CreateSession'>
				<div className='view__explanation'>Create a session to allow another device to connect.</div>
				<form className='view__box' onSubmit={ this.createSession }>
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
				</form>
			</div>
		);
	}
}

export default CreateSession;
