import { observer } from 'mobx-react';

import { Context, contextTypes } from 'shared/context';

export type TabId = 'sessions' | 'create' | 'join';

// https://github.com/DefinitelyTyped/DefinitelyTyped/issues/20544
const SessionLabel: React.StatelessComponent = observer(function (this: { context: Context }) {
	const sessions = this.context.store.sessions;
	return ('My sessions' + (sessions.length ? ` (${sessions.length})` : '' )) as any;
});
SessionLabel.contextTypes = contextTypes;

export const TabMap: {[tabId in TabId]: React.StatelessComponent}  = {
	sessions: SessionLabel,
	create: () => 'Create Session' as any,
	join: () => 'Join Session' as any
};

export const TabOrder: TabId[] = ['sessions', 'create', 'join'];
export const TabsInfo = TabOrder.map(tabId => ({ tabId, Label: TabMap[tabId] }));
