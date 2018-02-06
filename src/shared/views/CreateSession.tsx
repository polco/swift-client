import * as React from 'react';
import * as uuid from 'uuid/v4';

import CreateSessionAction from 'shared/actions/CreateSession';

import Button from 'shared/components/Button';
import TextField from 'shared/components/TextField';

import './CreateSession.less';

export type Props = {};

class CreateSession extends React.PureComponent<Props> {
	private sessionNameField!: TextField | null;
	private userNameField!: TextField | null;

	private createSession = () => {
		const sessionId = uuid();
		this.context.store.executeAction(new CreateSessionAction(
			sessionId,
			this.sessionNameField!.getValue(),
			this.userNameField!.getValue()
		));
		this.context.RTCClient.openSession(sessionId);
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
						<TextField
							label='choose a name to identify yourself'
							placeholder='Albert'
							ref={ ref => this.userNameField = ref }
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
