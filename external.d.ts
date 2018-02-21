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
		public toJSON(): JSON;

		public on(event: 'change', cb: (changed: Changed<R>) => void): void;
		public on(event: 'changes', cb: (changes: any, changed: Changed<R>) => void): void;
		public on(event: 'update', cb: (update: any, changed: Changed<R>) => void): void;
		public on(event: 'removed', cb: () => void): void;
	}

	export class Set {

	}

	export class Seq {

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
		public createSeq(key: string, value: string): Seq;
		public createSeq(filter: (row: Row<R>) => boolean): Seq;

		public on(event: 'update', cb: (update: any, source: any) => void): void;
		public on(event: 'create' | 'row_update', cb: (row: Row<R>) => void): void;
	}
}
