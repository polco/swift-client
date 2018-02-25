export type TabId = 'sessions' | 'create' | 'join';

export type TabComponentProps = {
	navigateToTab(tabId: TabId): void,
	navigateToSession(sessionId: string): void,
	sessionId: string | null
};
