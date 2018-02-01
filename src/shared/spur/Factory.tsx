import * as React from 'react';
import Plugin from './Plugin';

export type Tag = keyof JSX.IntrinsicElements;

export type Props<E extends HTMLElement = HTMLElement>
	= React.HTMLAttributes<E> & {
	plugins: {[pluginId: string]: Plugin},
	elementRef?: (instance: E) => any
};

export interface IPlugComponent<E extends HTMLElement = HTMLElement>
	extends React.Component<Props<E>, null> {
	element: E;
}

export interface IPlugComponentClass<E extends HTMLElement = HTMLElement> {
	new(props: Props<E>, context: any): IPlugComponent<E>;
}

export abstract class PlugComponent<P extends { plugins: {[pluginId: string]: Plugin} }, S = {}>
	extends React.PureComponent<P, S> {

	constructor(props: P, context: any) {
		super(props, context);

		for (const id in props.plugins) {
			const plugin = props.plugins[id];
			plugin.setComponentInstance(this);
		}
	}

	public componentWillMount() {
		const plugins = this.props.plugins;
		for (const id in plugins) {
			const plugin = plugins[id] as Plugin;
			plugin.componentWillMount();
		}
	}

	public componentDidMountWithElement(element: HTMLElement) {
		const plugins = this.props.plugins;
		for (const id in plugins) {
			const plugin = plugins[id];
			plugin.componentDidMount(element);
		}
	}

	public componentWillReceiveProps(nextProps: P) {
		const plugins = this.props.plugins;
		for (const id in plugins) {
			const plugin = plugins[id];
			plugin.componentWillReceiveProps(nextProps);
		}
	}

	public componentWillUpdate(nextProps: P) {
		const plugins = this.props.plugins;
		for (const id in plugins) {
			const plugin = plugins[id];
			plugin.componentWillUpdate(nextProps);
		}
	}

	public componentDidUpdate() {
		const plugins = this.props.plugins;
		for (const id in plugins) {
			const plugin = plugins[id];
			plugin.componentDidUpdate();
		}
	}

	public componentWillUnmount() {
		const plugins = this.props.plugins;
		for (const id in plugins) {
			const plugin = plugins[id];
			plugin.componentWillUnmount();
			plugin.removeEventListeners();
		}
	}
}

export function createPlugTagComponent<E extends HTMLElement = HTMLElement>(tag: Tag) {

	// tslint:disable:max-classes-per-file
	return class PlugTagComponent extends PlugComponent<Props<E>> {
		public element: E | null = null;

		constructor(props: Props<E>, context: any) {
			super(props, context);

			this.onRef = this.onRef.bind(this);
		}

		public componentDidMount() {
			this.componentDidMountWithElement(this.element!);
		}

		private onRef(instance: E) {
			this.element = instance;
			if (this.props.elementRef) {
				this.props.elementRef(instance);
			}
		}

		public render() {
			const ThisTag = tag as any;
			const { children, plugins, elementRef, ...props } = this.props;
			return(
				<ThisTag { ...props } ref={ this.onRef }>
					{ children }
				</ThisTag>
			);
		}
	};
}

export const Pdiv = createPlugTagComponent<HTMLDivElement>('div');
export const Pspan = createPlugTagComponent<HTMLSpanElement>('span');
