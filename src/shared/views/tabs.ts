export type TabId = 'sessions' | 'create' | 'join';

export type TabComponentProps = {
	navigateToTab(tabId: TabId): void,
	navigateToSession(sessionId: string, wasCreated?: boolean): void,
	sessionId: string | null
};
