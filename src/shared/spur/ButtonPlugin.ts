import { addListener, removeListener, SpurEvent, SpurPointerEvent } from 'spur-events';
import interactionLock from './interactionLock';
import Plugin from './Plugin';

interface IButtonPlugin {
	cancel(): void;
	DOMNode: HTMLElement | null;
}

export const current: {
	plugins: IButtonPlugin[],
	tapFired: boolean,
	doubleTapFired: boolean,
	longTapFired: boolean
} = { plugins: [], tapFired: false, doubleTapFired: false, longTapFired: false };

addListener(window, 'pointerup', function(e: SpurPointerEvent) {
	current.plugins = [];
});

function onLock(DOMNode: HTMLElement) {
	if (current.plugins.length) {
		current.plugins.forEach(plugin => {
			if (!current.longTapFired || DOMNode !== plugin.DOMNode) { plugin.cancel(); }
		});
		current.plugins = [];
	}
}

interactionLock.on('element-lock', onLock);
interactionLock.on('container-lock', onLock);

type Coords = { x: number, y: number };

const LONG_TAP_TIMEOUT = 700;
const DOUBLE_TAP_TIMEOUT = 300;
const MIN_TAP_DISTANCE = 15;

export type Events = {
	press: Coords,
	release: boolean,
	tap: SpurPointerEvent,
	doubleTap: SpurPointerEvent,
	longTap: Coords
};

class ButtonPlugin extends Plugin<Events> {
	private enable = true;
	private lockId: number | null = null;
	private lastTap = 0;
	private currentTap: SpurPointerEvent | null = null;
	private pointerId: string = '';
	private cancelled: boolean = false;
	private longTapTimeout: number = 0;
	private boundingBox = { left: 0, top: 0, width: 0, height: 0 };
	public DOMNode: HTMLElement | null = null;
	private minBoxWidth = MIN_TAP_DISTANCE;
	private minBoxHeight = MIN_TAP_DISTANCE;
	private isPressed = false;
	private repeatTimeout: number = 0;
	private repeatCount = 0;
	public repeat = false;

	constructor(options: { repeat?: boolean } = {}) {
		super();

		this.repeat = !!options.repeat;
	}

	public setMinBoxDimensions(width: number, height: number) {
		this.minBoxWidth = Math.max(width, MIN_TAP_DISTANCE);
		this.minBoxHeight = Math.max(height, MIN_TAP_DISTANCE);
	}

	private press(coords: Coords) {
		this.isPressed = true;
		if (this.repeat) {
			this.repeatCount = 0;
			this.repeatTap();
		}
		this.emit('press', coords);
	}

	private release(cancelled: boolean) {
		this.isPressed = false;
		this.emit('release', cancelled);
	}

	private tap(e: SpurPointerEvent) {
		this.emit('tap', e);
	}

	private doubleTap(e: SpurPointerEvent) {
		this.emit('doubleTap', e);
	}

	private longTap(coords: Coords) {
		this.emit('longTap', coords);
	}

	public setEnable(enable: boolean) {
		this.enable = enable;
	}

	private reset() {
		if (this.lockId) {
			interactionLock.releaseLock(this.lockId);
			this.lockId = null;
		}
		window.clearTimeout(this.repeatTimeout);
		window.clearTimeout(this.longTapTimeout);
		removeListener(document, 'pointermove', this.onPointerMove, { context: this });
		removeListener(document, 'pointerup', this.onPointerUp, { context: this });
	}

	private repeatTap() {
		const time = this.repeatCount === 0 ? 300 : 20;

		this.repeatTimeout = window.setTimeout(() => {
			this.repeatCount += 1;
			this.tap(this.currentTap!);
			this.repeatTap();
		}, time);
	}

	public cancel() {
		if (this.isPressed) {
			this.cancelled = true;
			this.release(true);
		}

		this.reset();
	}

	private onPointerMove(e: SpurPointerEvent) {
		if (e.pointerId !== this.pointerId) { return; }
		if (e.clientX < this.boundingBox.left ||
			e.clientX > this.boundingBox.left + this.boundingBox.width ||
			e.clientY < this.boundingBox.top ||
			e.clientY > this.boundingBox.top + this.boundingBox.height) {
			this.cancel();
		}
	}

	private onPointerDown(e: SpurPointerEvent) {
		if (!this.enable || (e.originalEvent as MouseEvent).which === 3 || interactionLock.isLocked(e.target as Node)) {
			return;
		}

		current.plugins.push(this);
		this.pointerId = e.pointerId;

		this.cancelled = false;
		const startTap = {
			x: e.clientX,
			y: e.clientY
		};

		const target = e.target;

		const boundingBox = this.DOMNode!.getBoundingClientRect();
		this.boundingBox.top = boundingBox.top;
		this.boundingBox.left = boundingBox.left;
		if (boundingBox.width < this.minBoxWidth) {
			this.boundingBox.width = this.minBoxWidth;
			this.boundingBox.left -= (this.minBoxWidth - boundingBox.width) / 2;
		} else {
			this.boundingBox.width = boundingBox.width;
		}

		if (boundingBox.height < this.minBoxHeight) {
			this.boundingBox.height = this.minBoxHeight;
			this.boundingBox.top -= (this.minBoxHeight - boundingBox.height) / 2;
		} else {
			this.boundingBox.height = boundingBox.height;
		}

		if (this.repeat) {
			this.currentTap = new SpurEvent(e.type) as SpurPointerEvent;
			this.currentTap = Object.assign(this.currentTap, e); // tslint:disable-line: prefer-object-spread
		}
		this.press(startTap);

		current.tapFired = current.doubleTapFired = current.longTapFired = false;
		if (this.hasListener('longTap') && !this.repeat) {
			window.clearTimeout(this.longTapTimeout);
			this.longTapTimeout = window.setTimeout(() => {
				this.lockId = interactionLock.requestLockOn(target as Node);
				if (this.lockId) {
					this.longTap(startTap);
					current.longTapFired = true;
				}
			}, LONG_TAP_TIMEOUT);
		}

		addListener(document, 'pointermove', this.onPointerMove, { context: this });
		addListener(document, 'pointerup', this.onPointerUp, { context: this });
	}

	private onPointerUp(e: SpurPointerEvent) {
		if (e.pointerId !== this.pointerId || this.cancelled) {
			return;
		}

		this.reset();
		this.release(false);

		if (!current.longTapFired) {
			const now = Date.now();
			const tapDiff = now - this.lastTap;
			this.lastTap = now;

			if (!current.tapFired && this.hasListener('tap')) {
				current.tapFired = true;
				this.tap(e);
			}

			if (tapDiff < DOUBLE_TAP_TIMEOUT) {
				this.lastTap = 0;
				if (!current.doubleTapFired && this.hasListener('doubleTap')) {
					current.doubleTapFired = true;
					e.preventDefault();
					this.doubleTap(e);
				}
				return;
			}
		}
	}

	public componentDidMount(DOMNode: HTMLElement) {
		this.DOMNode = DOMNode;
		addListener(this.DOMNode, 'pointerdown', this.onPointerDown, { context: this });
	}

	public componentWillUnmount() {
		removeListener(this.DOMNode!, 'pointerdown', this.onPointerDown, { context: this });
		this.reset();
		this.DOMNode = null;
		window.clearTimeout(this.repeatTimeout);
	}
}

export default ButtonPlugin;
