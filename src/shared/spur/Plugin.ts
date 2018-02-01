abstract class Plugin<P extends {[eventName: string]: any} = {}> {
	public setComponentInstance(component: React.Component<any, any>): void {
		//
	}

	public componentDidMount(Element: HTMLElement): void {
		//
	}

	public componentWillMount(): void {
		//
	}

	public componentWillReceiveProps(nextProps: any): void {
		//
	}

	public componentWillUpdate(nextProps: any): void {
		//
	}

	public componentDidUpdate(): void {
		//
	}

	public componentWillUnmount(): void {
		//
	}

	private listeners: {[T in keyof P]: Array<{ callback: (arg: P[T]) => void, context: any }>} = {} as any;

	public on<T extends keyof P, C>(eventName: T, callback: (this: C, arg: P[T]) => void, context: C | this = this) {
		if (eventName in this.listeners) {
			this.listeners[eventName].push({ callback, context });
		} else {
			this.listeners[eventName] = [{ callback, context }];
		}
	}

	public removeEventListeners() {
		this.listeners = {} as any;
	}

	protected emit<T extends keyof P>(eventName: T, arg: P[T]) {
		const listeners = this.listeners[eventName];
		if (listeners) {
			for (let i = 0, len = listeners.length; i < len; i += 1) {
				const listener = listeners[i];
				listener.callback.call(listener.context, arg);
			}
		}
	}

	public hasListener(eventName: keyof P): boolean {
		return !!this.listeners[eventName];
	}
}

export default Plugin;
