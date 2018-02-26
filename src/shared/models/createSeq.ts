import { Doc as CRDTDoc, Row, Seq } from 'crdt';
import { IDoc } from 'shared/models/Doc';
import Store from 'shared/Store';

function setupSeq<D extends IDoc, L>(store: Store, seq: Seq<D>, list: L[], rowToValue: (row: Row<D>) => L) {
	seq.forEach(row => list.push(rowToValue(row)));

	seq.on('add', row => {
		const index = seq.indexOf(row);
		if (index !== -1) {
			const v = rowToValue(row);
			store.pendingSeqActions.push(() => {
				list.splice(index, 0, v);
			});
		}
	});

	// seq.on('move', () => console.log('move')); // TODO

	seq.on('remove', row => {
		const v = rowToValue(row);
		const index = list.indexOf(v);
		if (index !== -1) {
			store.pendingSeqActions.push(() => {
				list.splice(index, 1);
			});
		}
	});
}

export default function createSeq<D extends IDoc, K extends keyof D, L>(
	crdt: CRDTDoc<D>, store: Store, key: K, value: D[K], list: L[], rowToValue: (row: Row<D>) => L
) {
	const seq = crdt.createSeq(key, value);
	setupSeq(store, seq, list, rowToValue);
	return list;
}

export function createFilteredSeq<D extends IDoc, L>(
	crdt: CRDTDoc<D>, store: Store, filter: (row: D) => boolean, list: L[], rowToValue: (row: Row<D>) => L
) {
	const seq = crdt.createSeq(filter);
	setupSeq(store, seq, list, rowToValue);
	return list;
}
