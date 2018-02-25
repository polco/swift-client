import { observer } from 'mobx-react';
import * as React from 'react';
import * as uuid from 'uuid/v4';

import CreateDoc from 'shared/actions/CreateDoc';
import Button from 'shared/components/Button';
import { Context, contextTypes } from 'shared/context';
import { IItem } from 'shared/models/Item';

import './SessionViewer.less';

export type Props = {
	sessionId: string
};

@observer
class SessionViewer extends React.Component<Props> {
	public context!: Context;
	public static contextTypes = contextTypes;
	private input!: HTMLInputElement | null;

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

	private validateAddText = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		this.addText();
	}

	public render() {
		const store = this.context.store;
		const { sessionId } = this.props;
		const session = store.getSession(sessionId);

		const itemElements: JSX.Element[] = [];

		const itemIds = session.itemIds;

		let lastCreatorId: string = '';
		let currentClientElements: JSX.Element[] = [];
		for (let i = itemIds.length - 1; i >= 0; i -= 1) {
			const itemId = itemIds[i];
			const item = store.getItem(itemId);
			if (item.creatorId !== lastCreatorId) {
				lastCreatorId = item.creatorId;
				currentClientElements = [];

				itemElements.push(
					<div
						key={ itemIds.length - i }
						className={
							'SessionViewer__client-block' +
							(lastCreatorId === store.userIdPerSessionId[sessionId] ? ' SessionViewer__client-block_you' : '')
						}
					>
						<div className='SessionViewer__item-creator'>{ store.getUser(item.creatorId).name }</div>
						<div className='SessionViewer__items'>{ currentClientElements }</div>
					</div>
				);
			}

			currentClientElements.push(
				<div className='SessionViewer__item' key={ itemIds.length - i }>{ item.itemContent.content }</div>
			);
		}

		return (
			<div className='SessionViewer'>
				<div className='SessionViewer__item-list'>{ itemElements }</div>
				<form className='SessionViewer__input-area' onSubmit={ this.validateAddText }>
					<input className='SessionViewer__text-input' ref={ ref => this.input = ref } />
					<Button onTap={ this.addText } className='SessionViewer__add'>Add</Button>
				</form>
			</div>
		);
	}
}

export default SessionViewer;
