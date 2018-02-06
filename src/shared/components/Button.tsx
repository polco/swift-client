import * as React from 'react';
import ButtonPlugin from 'shared/spur/ButtonPlugin';
import { Pdiv } from 'shared/spur/Factory';
import { SpurPointerEvent } from 'spur-events';
import './Button.less';

export interface IButtonClass<P> {
	new (props?: Props<P>, context?: any): Button<P>;
	prototype: Button<P>;
}

export type Props<P = {}> = {
	repeat?: boolean,
	disabled?: boolean,
	className?: string,
	style?: React.CSSProperties,
	elementRef?: (ref: HTMLDivElement | null) => void,
	onTap?: (component: Button<P>, e: SpurPointerEvent) => void,
	onDoubleTap?: (component: Button<P>, e: SpurPointerEvent) => void,
} & P;

class Button<P = Props> extends React.PureComponent<Props<P>> {
	private plugins: { button: ButtonPlugin };
	public div: HTMLDivElement | null = null;

	constructor(props: Props<P>, context: any) {
		super(props, context);

		const button = new ButtonPlugin();
		this.plugins = { button };
		button.setEnable(!props.disabled);
		button.repeat = !!props.repeat;

		if (this.props.onTap) { button.on('tap', this.onTap); }
		if (this.props.onDoubleTap) { button.on('doubleTap', this.onDoubleTap); }
	}

	public componentWillReceiveProps(nextProps: Props<P>) {
		const button = this.plugins.button;
		button.setEnable(!nextProps.disabled);
		button.repeat = !!nextProps.repeat;

		if (nextProps.onTap && !button.hasListener('tap')) { button.on('tap', this.onTap); }
		if (nextProps.onDoubleTap && !button.hasListener('doubleTap')) { button.on('doubleTap', this.onDoubleTap); }
	}

	private onTap = (e: SpurPointerEvent) => {
		this.props.onTap!(this, e);
	}

	private onDoubleTap = (e: SpurPointerEvent) => {
		this.props.onDoubleTap!(this, e);
	}

	private onRef = (div: HTMLDivElement | null) => {
		this.div = div;
		if (this.props.elementRef) { this.props.elementRef(div); }
	}

	public render() {
		const { className, disabled, children, style } = this.props;

		const cn =
			'button' +
			(className ? ' ' + className : '') +
			(disabled ? ' disabled' : '');

		const props = {
			className: cn,
			elementRef: this.onRef,
			plugins: this.plugins,
			style
		};

		return React.createElement(Pdiv, props, children);
	}
}

export default Button;
