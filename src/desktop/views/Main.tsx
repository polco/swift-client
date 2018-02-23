import { Lambda, observe } from 'mobx';
import DevTools, { configureDevtool } from 'mobx-react-devtools';
import * as React from 'react';

configureDevtool({
	logEnabled: true
});

import { Context, contextTypes } from 'shared/context';
import Store from 'shared/Store';

import CreateSession from 'shared/views/CreateSession';
import JoinSession from 'shared/views/JoinSession';
import Sessions from 'shared/views/Sessions';
import SessionViewer from 'shared/views/SessionViewer';
import { TabComponentProps, TabId, TabsInfo } from 'shared/views/tabs';

import Tabs, { LabelProps } from 'shared/components/Tabs';

import './Main.less';

export type Props = {};
type State = {
	tabId: TabId | 'session',
	tabs: Array<Array<{ tabId: string, Label: React.StatelessComponent<LabelProps> }>>,
	category: number,
	sessionId: string | null
};

const ContentClasses: {[tabId in TabId]: React.ComponentClass<TabComponentProps> } = {
	sessions: Sessions,
	create: CreateSession,
	join: JoinSession
};

class Main extends React.PureComponent<Props, State> {
	private store: Store;
	private sessionsObserverDispose: Lambda;
	public static childContextTypes = contextTypes;

	constructor(props: Props, context: any) {
		super(props, context);

		this.store = new Store();
		this.state = { tabId: 'create', tabs: [[], TabsInfo], category: 1, sessionId: null };

		this.sessionsObserverDispose = observe(this.store.sessionList, () => {
			this.setState({
				tabs: [
					this.store.sessionList.map(sessionId => {
						const session = this.store.getSession(sessionId);
						return { tabId: sessionId, Label: () => session.name as any };
					}),
					TabsInfo
				]
			});
		});
	}

	public componentWillUnmount() {
		this.sessionsObserverDispose();
	}

	public getChildContext(): Context {
		return { store: this.store };
	}

	private selectTab = (tabId: TabId | string) => {
		if (this.state.category === 0) {
			this.setState({ tabId: 'session', sessionId: tabId });
		} else {
			this.setState({ tabId: tabId as TabId });
		}
	}

	private navigateToSession = (sessionId: string) => {
		this.setState({ tabId: 'session', category: 0, sessionId });
	}

	private navigateToTab = (tabId: TabId) => {
		this.setState({ tabId, category: 1 });
	}

	public render() {
		const { tabs, tabId, category, sessionId } = this.state;
		const ContentClass = tabId === 'session' ? SessionViewer : ContentClasses[tabId];

		return (
			<div className='Main'>
				<Tabs
					tabs={ tabs }
					categoryIndex={ category }
					currentTabId={ tabId === 'session' && sessionId ? sessionId : tabId }
					onTabSelect={ this.selectTab }
				/>
				<div className='Main__tab-container'>
					<ContentClass
						navigateToSession={ this.navigateToSession }
						navigateToTab={ this.navigateToTab }
						sessionId={ sessionId }
					/>
				</div>
				{ __IS_DEV__ &&  <DevTools /> }
			</div>
		);
	}
}

export default Main;
