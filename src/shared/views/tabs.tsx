import { observer } from 'mobx-react';

import { Context, contextTypes } from 'shared/context';

export type TabId = 'sessions' | 'create' | 'join';

export type TabComponentProps = {
	navigateToTab(tabId: TabId): void,
	navigateToSession(sessionId: string): void,
	sessionId: string | null
};

import { LabelProps } from 'shared/components/Tabs';

// https://github.com/DefinitelyTyped/DefinitelyTyped/issues/20544
const SessionsLabel: React.StatelessComponent<LabelProps> = observer(function (
	this: { context: Context }, props: LabelProps
) {
	props.onUpdate();
	const sessions = this.context.store.sessionList;
	return ('My sessions' + (sessions.length ? ` (${sessions.length})` : '' )) as any;
});
SessionsLabel.contextTypes = contextTypes;

export const TabMap: {[tabId in TabId]: React.StatelessComponent<LabelProps>}  = {
	sessions: SessionsLabel,
	create: () => 'Create Session' as any,
	join: () => 'Join Session' as any
};

export const TabOrder: TabId[] = ['sessions', 'create', 'join'];
export const TabsInfo = TabOrder.map(tabId => ({ tabId, Label: TabMap[tabId] }));
