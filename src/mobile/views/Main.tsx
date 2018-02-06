import DevTools, { configureDevtool } from 'mobx-react-devtools';
import * as React from 'react';

configureDevtool({
	logEnabled: true
});

import { Context, contextTypes } from 'shared/context';
import RTCClient from 'shared/RTCClient';
import Store from 'shared/Store';

import CreateSession from 'shared/views/CreateSession';
import JoinSession from 'shared/views/JoinSession';
import Sessions from 'shared/views/Sessions';
import { TabId, TabsInfo } from 'shared/views/tabs';

import Tabs from 'shared/components/Tabs';

import './Main.less';

export type Props = {};
type State = {
	tabId: TabId
};

const ContentClasses: {[tabId in TabId]: React.ComponentClass} = {
	sessions: Sessions,
	create: CreateSession,
	join: JoinSession
};

class Main extends React.PureComponent<Props, State> {
	private store: Store;
	private RTCClient: RTCClient;

	constructor(props: Props, context: any) {
		super(props, context);

		this.store = new Store();
		this.RTCClient = new RTCClient();
		this.state = { tabId: 'create' };
	}

	public static childContextTypes = contextTypes;

	public getChildContext(): Context {
		return { RTCClient: this.RTCClient, store: this.store };
	}

	private selectTab = (tabId: TabId) => {
		this.setState({ tabId });
	}

	public render() {
		const currentTabId = this.state.tabId;
		const ContentClass = ContentClasses[currentTabId];

		return (
			<div className='Main'>
				<Tabs
					tabs={ TabsInfo }
					currentTabId={ currentTabId }
					onTabSelect={ this.selectTab }
				/>
				<div className='Main__tab-container'><ContentClass /></div>
				{ __IS_DEV__ &&  <DevTools /> }
			</div>
		);
	}
}

export default Main;
