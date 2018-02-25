import * as React from 'react';

import './TextField.less';

export type Props = {
	label: string,
	placeholder: string,
	className?: string
};

class TextField extends React.PureComponent<Props> {
	private mainDiv: HTMLDivElement | null = null;
	private input: HTMLInputElement | null = null;
	private content: string = '';

	constructor(props: Props, context: any) {
		super(props, context);

		this.state = { hasContent: false };
	}

	private onChange = () => {
		this.content = this.input!.value;
	}

	private onMainRef = (div: HTMLDivElement | null) => {
		this.mainDiv = div;
	}

	private onBlur = () => {
		this.mainDiv!.className = this.generateClassName();
	}

	private onInputRef = (input: HTMLInputElement | null) => {
		this.input = input;
	}

	private generateClassName(): string {
		return 'TextField' + (this.content.length ? ' TextField_hasContent' : '');
	}

	public getValue() { return this.content; }

	public setValue(value: string) { return this.input!.value = value; }

	public blur() { this.input!.blur(); }

	public render() {
		const { label, placeholder } = this.props;

		return (
			<div className={ this.generateClassName() } ref={ this.onMainRef }>
				<div className='TextField__label'>{ label }</div>
				<input
					className='TextField__input'
					placeholder={ placeholder }
					onChange={ this.onChange }
					onBlur={ this.onBlur }
					ref={ this.onInputRef }
				/>
			</div>
		);
	}
}

export default TextField;
