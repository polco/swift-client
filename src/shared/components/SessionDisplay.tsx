import { observer } from 'mobx-react';
import * as React from 'react';
import * as uuid from 'uuid/v4';

import CreateDoc from 'shared/actions/CreateDoc';
import Button from 'shared/components/Button';
import { Context, contextTypes } from 'shared/context';
import { IItem } from 'shared/models/Item';

import './SessionDisplay.less';

export type Props = {
	sessionId: string
};

@observer
class SessionDisplay extends React.Component<Props> {
	public context!: Context;
	public static contextTypes = contextTypes;
	private input!: HTMLInputElement | null;
	private scrollDiv!: HTMLDivElement | null;
	private isScrolledAtBottom = true;
	private focusTimeout: number = -1;

	public componentDidUpdate() {
		if (this.isScrolledAtBottom) {
			this.scrollDiv!.scrollTo(0, this.scrollDiv!.scrollHeight);
		}
	}

	public componentWillUnmount() {
		window.clearTimeout(this.focusTimeout);
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

		this.focusTimeout = window.setTimeout(this.focusInput, 0);
	}

	private focusInput = () => {
		this.input!.focus();
	}

	private validateAddText = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		this.addText();
	}

	private onScroll = () => {
		const { scrollHeight, scrollTop, clientHeight } = this.scrollDiv!;
		this.isScrolledAtBottom = Math.abs(clientHeight + scrollTop - scrollHeight) < 10;
	}

	public render() {
		const store = this.context.store;
		const { sessionId } = this.props;
		const session = store.getSession(sessionId);

		const itemElements: JSX.Element[] = [];

		const itemIds = session.itemIds;

		let lastCreatorId: string = '';
		let currentClientElements: JSX.Element[] = [];
		for (let i = 0; i < itemIds.length; i += 1) {
			const itemId = itemIds[i];
			const item = store.getItem(itemId);
			if (item.creatorId !== lastCreatorId) {
				lastCreatorId = item.creatorId;
				currentClientElements = [];

				itemElements.push(
					<div
						key={ i }
						className={
							'SessionDisplay__client-block' +
							(lastCreatorId === store.userIdPerSessionId[sessionId] ? ' SessionDisplay__client-block_you' : '')
						}
					>
						<div className='SessionDisplay__item-creator'>{ store.getUser(item.creatorId).name }</div>
						<div className='SessionDisplay__items'>{ currentClientElements }</div>
					</div>
				);
			}

			currentClientElements.push(
				<div className='SessionDisplay__item' key={ i }>{ item.itemContent.content }</div>
			);
		}

		return (
			<div className='SessionDisplay'>
				<div
					className='SessionDisplay__scroller-container'
					onScroll={ this.onScroll }
					ref={ ref => this.scrollDiv = ref }
				>
					<div className='SessionDisplay__item-list'>
						{ itemElements }
					</div>
				</div>
				<form className='SessionDisplay__input-area' onSubmit={ this.validateAddText }>
					<input className='SessionDisplay__text-input' ref={ ref => this.input = ref } />
					<Button onTap={ this.addText } className='SessionDisplay__add action-button'>Add</Button>
				</form>
			</div>
		);
	}
}

export default SessionDisplay;
