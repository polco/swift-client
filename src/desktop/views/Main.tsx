import DevTools, { configureDevtool } from 'mobx-react-devtools';
import * as React from 'react';

configureDevtool({
	logEnabled: true
});

import { Context, contextTypes } from 'shared/context';
import Store from 'shared/Store';

import SessionViewer from 'desktop/views/SessionViewer';

import CreateSession from 'shared/views/CreateSession';
import JoinSession from 'shared/views/JoinSession';
import Sessions from 'shared/views/Sessions';
import { TabComponentProps, TabId } from 'shared/views/tabs';

import { TabsInfo } from './tabs';

import Sidebar from 'desktop/components/Sidebar';
import Tabs from 'shared/components/Tabs';

import './Main.less';

export type Props = {};
type State = {
	tabId: TabId,
	sessionId: string | null
};

const ContentClasses: {[tabId in TabId]: React.ComponentClass<TabComponentProps> } = {
	sessions: Sessions,
	create: CreateSession,
	join: JoinSession
};

class Main extends React.PureComponent<Props, State> {
	private store: Store;
	public static childContextTypes = contextTypes;

	constructor(props: Props, context: any) {
		super(props, context);

		this.store = new Store();
		this.state = { tabId: 'sessions', sessionId: null };
	}

	public getChildContext(): Context {
		return { store: this.store };
	}

	private selectTab = (tabId: TabId) => {
		this.setState({ tabId, sessionId: null });
	}

	private navigateToSession = (sessionId: string) => {
		this.setState({ tabId: 'sessions', sessionId });
	}

	private navigateToTab = (tabId: TabId) => {
		this.setState({ tabId, sessionId: null });
	}

	public render() {
		const { tabId, sessionId } = this.state;
		const ContentClass = ContentClasses[tabId];

		return (
			<div className='Main'>
				<div className='Main__header'>
					<div className='Main__title'>
						Swift
					</div>
					<Tabs
						tabs={ TabsInfo }
						categoryIndex={ 0 }
						currentTabId={ tabId }
						onTabSelect={ this.selectTab }
						hideIndicator={ !!sessionId }
					/>
				</div>
				<div className='Main__body'>
					<Sidebar selectSession={ this.navigateToSession } sessionId={ sessionId } />
					<div className='Main__tab-container'>
						{ sessionId
							? <SessionViewer sessionId={ sessionId } />
							: <ContentClass
								navigateToSession={ this.navigateToSession }
								navigateToTab={ this.navigateToTab }
								sessionId={ sessionId }
							/>
						}

					</div>
				</div>
				{ __IS_DEV__ &&  <DevTools /> }
			</div>
		);
	}
}

export default Main;
