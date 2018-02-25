import { observer } from 'mobx-react';
import * as React from 'react';

import UpdateUserName from 'shared/actions/UpdateUserName';

import Button from 'shared/components/Button';
import SessionItem from 'shared/components/SessionItem';
import TextField from 'shared/components/TextField';
import { Context, contextTypes } from 'shared/context';
import { TabComponentProps } from 'shared/views/tabs';

import './Sessions.less';

@observer
class Sessions extends React.Component<TabComponentProps> {
	public context!: Context;
	public static contextTypes = contextTypes;
	private clientNameField!: TextField | null;

	private onEnterSession = (sessionId: string) => {
		this.props.navigateToSession(sessionId);
	}

	private updateUserName = () => {
		const userName = this.clientNameField!.getValue();
		if (userName === '') { return; }

		this.clientNameField!.setValue('');
		this.clientNameField!.blur();

		const store = this.context.store;
		if (userName !== store.userName) {
			store.executeAction(new UpdateUserName(userName));
		}
	}

	private userNameValidate = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		this.updateUserName();
	}

	private create = () => {
		this.props.navigateToTab('create');
	}

	private join = () => {
		this.props.navigateToTab('join');
	}

	public render() {
		const store = this.context.store;
		const sessionList = store.sessionList;

		return (
			<div className='Sessions'>
				{
					sessionList.length === 0 ?
					<React.Fragment>
					<div className='view__explanation'>To start, setup your name.</div>
					<form className='view__box' onSubmit={ this.userNameValidate }>
						<div className='view__column'>
							<TextField
								label='choose a name to identify this client'
								placeholder={ this.context.store.userName }
								ref={ ref => this.clientNameField = ref }
							/>
						</div>
						<div className='view__column'>
							<Button className='action-button' onTap={ this.updateUserName }>
								Set
							</Button>
						</div>
					</form>
					<div className='view__explanation'>Create or Join a session.</div>
					<div className='view__box'>
						<div className='view__column'>
							<Button onTap={ this.create }>
								Create
							</Button>
						</div>
						<div className='view__column'>
						<Button onTap={ this.join }>
								Join
							</Button>
						</div>
					</div>
					</React.Fragment>
					: null
				}
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
