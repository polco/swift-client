import { observer } from 'mobx-react';
import * as QRCode from 'qrcode.react';
import * as React from 'react';
import * as uuid from 'uuid/v4';

import Button from 'shared/components/Button';
import { Context, contextTypes } from 'shared/context';
import CreateDoc from '../actions/CreateDoc';

import { IItem } from 'shared/models/Item';

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
	private input!: HTMLInputElement | null;

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

	private addText = () => {
		const value = this.input!.value;
		if (value === '') { return; }

		const itemId = 'item-' + uuid();
		this.context.store.executeAction(new CreateDoc<IItem>({
			id: itemId,
			type: 'item',
			creatorId: this.context.store.userId,
			creationDate: new Date().toISOString(),
			itemContent: { type: 'text', content: value }
		}, this.props.sessionId));
		this.input!.value = '';
	}

	public render() {
		const { sessionId } = this.props;
		const { info } = this.state;
		const store = this.context.store;
		const session = store.getSession(sessionId);

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
			</Button>
		);
	}
}

export default SessionItem;
