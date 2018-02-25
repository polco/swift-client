import { observer } from 'mobx-react';

import { Context, contextTypes } from 'shared/context';
import { TabId } from 'shared/views/tabs';

import { LabelProps } from 'shared/components/Tabs';

// https://github.com/DefinitelyTyped/DefinitelyTyped/issues/20544
const SessionsLabel: React.StatelessComponent<LabelProps> = observer(function (
	this: { context: Context }, props: LabelProps
) {
	props.onUpdate();
	const sessions = this.context.store.sessionList;
	return ('Sessions' + (sessions.length ? ` (${sessions.length})` : '' )) as any;
});
SessionsLabel.contextTypes = contextTypes;

export const TabMap: {[tabId in TabId]: React.StatelessComponent<LabelProps>}  = {
	sessions: SessionsLabel,
	create: () => 'Create' as any,
	join: () => 'Join' as any
};

const order: TabId[] = ['sessions', 'create', 'join'];
export const TabsInfo = order.map(tabId => ({ tabId, Label: TabMap[tabId] }));
