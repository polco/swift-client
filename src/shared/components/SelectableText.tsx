import * as React from 'react';
import interactionLock from 'shared/spur/interactionLock';

import './SelectableText.less';

export type Props = {
	text: string,
	className?: string
};

class SelectableText extends React.Component<Props> {
	private div!: HTMLDivElement | null;
	private lock!: number | null;

	public componentWillUnmount() {
		window.removeEventListener('mouseup', this.onMouseUp);
	}

	private onMouseDown = () => {
		this.lock = interactionLock.requestLockOn(this.div!);

		if (this.lock) {
			window.addEventListener('mouseup', this.onMouseUp);
		}
	}

	private onMouseUp = () => {
		interactionLock.releaseLock(this.lock!);
	}

	public render() {
		const { text, className } = this.props;

		return (
			<div
				className={ 'SelectableText' + (className ? ' ' + className : '') }
				onMouseDown={ this.onMouseDown }
				ref={ ref => this.div = ref }
			>
				{ text }
			</div>
		);
	}
}

export default SelectableText;
