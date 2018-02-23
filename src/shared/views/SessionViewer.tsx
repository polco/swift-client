import { observer } from 'mobx-react';
import * as React from 'react';
import * as uuid from 'uuid/v4';

import CreateDoc from 'shared/actions/CreateDoc';
import Button from 'shared/components/Button';
import { Context, contextTypes } from 'shared/context';
import { IItem } from 'shared/models/Item';
import { TabComponentProps } from 'shared/views/tabs';

import './SessionViewer.less';

@observer
class SessionViewer extends React.Component<TabComponentProps> {
	public context!: Context;
	public static contextTypes = contextTypes;
	private closingTimeout: number = -1;
	private input!: HTMLInputElement | null;

	public componentWillUnmount() {
		window.clearTimeout(this.closingTimeout);
	}

	public open(sessionId: string) {
		this.setState({ sessionId });
	}

	private addText = () => {
		const value = this.input!.value;
		const sessionId = this.props.sessionId;
		if (value === '' || !sessionId) { return; }

		const itemId = 'item-' + uuid();
		this.context.store.executeAction(new CreateDoc<IItem>({
			id: itemId,
			type: 'item',
			creatorId: this.context.store.userIdPerSessionId[sessionId],
			creationDate: new Date().toISOString(),
			itemContent: { type: 'text', content: value }
		}, sessionId));
		this.input!.value = '';
	}

	private goBack = () => {
		this.props.navigateToTab('sessions');
	}

	public render() {
		const store = this.context.store;
		const { sessionId } = this.props;
		const session = sessionId && store.getSession(sessionId) || null;

		return (
			<div className='SessionViewer'>
				<div className='SessionViewer__header'>
					<Button className='SessionViewer__name'>{ session && session.name }</Button>
					<Button className='SessionViewer__back' onTap={ this.goBack }>Back</Button>
				</div>
				<div className='SessionViewer__body'>
				{
					session && (
						<React.Fragment>
							<div className='SessionItem__user-list'>
							{
								session.userIds.map(userId =>
									<div className='SessionItem__user' key={ userId }>
										{ store.getUser(userId).name }
									</div>
								)
							}
							</div>

							<div className='SessionItem__item-list'>
							{
								session.itemIds.map(itemId =>
									<div className='SessionItem__item' key={ itemId }>
										{ store.getItem(itemId).itemContent.content }
									</div>
								)
							}
							</div>

							<div className='SessionItem_add-text'>
								<input className='SessionItem_text-input' ref={ ref => this.input = ref } />
								<Button onTap={ this.addText }>Send text</Button>
							</div>
						</React.Fragment>
					)
				}
				</div>
			</div>
		);
	}
}

export default SessionViewer;
