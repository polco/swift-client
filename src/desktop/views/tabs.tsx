import { TabId } from 'shared/views/tabs';

import { LabelProps } from 'shared/components/Tabs';

export const TabMap: {[tabId in TabId]: React.StatelessComponent<LabelProps>}  = {
	sessions: () => 'My sessions' as any,
	create: () => 'Create Sessions' as any,
	join: () => 'Join Sessions' as any
};

const order: TabId[] = ['sessions', 'create', 'join'];
export const TabsInfo = [order.map(tabId => ({ tabId, Label: TabMap[tabId] }))];
