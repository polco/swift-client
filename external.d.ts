// tslint:disable:max-classes-per-file
declare const ENV: 'mobile' | 'desktop';
declare const __SOCKET_END_POINT__: string;
declare const __IS_DEV__: boolean;
declare module 'fork-ts-checker-webpack-plugin';
declare module 'happypack';
declare module 'debug-logger';
declare module 'uglifyjs-webpack-plugin';
declare module 'instascan';

declare module 'rtc-dcstream' {
	import { Duplex } from 'stream';
	type createStream = (dc: RTCDataChannel) => Duplex;
	const cs: createStream;
	export = cs;
}

declare module 'crdt' {
	import { SocketConnectOpts } from 'net';
	import { Duplex } from 'stream';

	type Changed<R> = {[K in keyof R]?: R[K]};

	export class Row<R extends any = any> {
		public get<K extends keyof R>(key: K): R[K];
		public set<K extends keyof R>(key: K, value: R[K]): void;
		public set(row: R): void;
		public toJSON(): R;

		public on(event: 'change', cb: (changed: Changed<R>) => void): void;
		public on(event: 'changes', cb: (changes: any, changed: Changed<R>) => void): void;
		public on(event: 'update', cb: (update: any, changed: Changed<R>) => void): void;
		public on(event: 'removed', cb: () => void): void;
	}

	export class Set<R extends any = any> {
		public on(event: 'add' | 'remove', cb: (row: Row<R>) => void): void;
	}

	export class Seq<R extends any = any> extends Set<R> {
		public on(event: 'add' | 'remove' | 'move', cb: (row: Row<R>) => void): void;
		public asArray(): Array<Row<R>>;
		public forEach(cb: (row: Row<R>) => void): void;
		public has(rowIndo: string | Row<R>): boolean;
		public indexOf(rowIndo: string | Row<R>): number;
	}

	export class Doc<R extends object = any> {
		public createStream(opts?: SocketConnectOpts): Duplex;
		public add(obj: { id?: string }): Row<R>;
		public get(id: string): Row;
		public set(id: string, row: R): Row<R>;
		public rm(id: string): void;
		public toJSON(): JSON;
		public createSet(key: string, value: string): Set;
		public createSet(filter: (row: Row<R>) => boolean): Set;
		public createSeq<R extends any, T extends keyof R>(key: T, value: R[T]): Seq<R>;
		public createSeq(filter: (row: Row<R>) => boolean): Seq;

		public on(event: 'update', cb: (update: any, source: any) => void): void;
		public on(event: 'create' | 'row_update', cb: (row: Row<R>) => void): void;
	}
}
