import * as React from 'react';
import Button, { IButtonClass } from 'shared/components/Button';
import SessionDisplay from 'shared/components/SessionDisplay';
import SessionScanner from 'shared/components/SessionScanner';
import RTCClient from 'shared/RTCClient';
import './Main.less';

type TabId = 'home' | 'create' | 'join';
type TabButtonProps = { tabId: TabId };
const TabButton = Button as IButtonClass<TabButtonProps>;

export type Props = {};
type State = {
	tabId: TabId
};

const TABS_ORDER: TabId[] = ['home', 'create', 'join'];

class Home extends React.PureComponent<Props, State> {
	private client: RTCClient;
	private TABS_MAP: { [tabId in TabId]: { label: string, render: () => React.ReactElement<any> } } = {
		home: {
			label: 'Home',
			render(this: Home) { return <div className='Home'>Welcome!</div>; }
		},
		create: {
			label: 'Create Session',
			render(this: Home) { return <SessionDisplay client={ this.client } />; }
		},
		join: {
			label: 'Join Session',
			render(this: Home) { return <SessionScanner onSessionScanned={ this.onSessionScanned } />; }
		}
	};
	private indicator: HTMLDivElement | null = null;

	constructor(props: Props, context: any) {
		super(props, context);

		this.state = { tabId: 'home' };

		this.client = new RTCClient();
	}

	private onSessionScanned = (sessionId: string) => {
		this.client.connectTo(sessionId);
	}

	private selectTab = (button: Button<TabButtonProps>) => {
		this.setState({ tabId: button.props.tabId });
	}

	public render() {
		const currentTabId = this.state.tabId;

		return (
			<div className='Main'>
				<div className='Main__tabs'>
					{
						TABS_ORDER.map(tabId =>
							<TabButton
								key={ tabId }
								className={ 'Main__tab' + (currentTabId === tabId ? ' Main__tab_active' : '') }
								onTap={ this.selectTab }
								tabId={ tabId }
							>
								{ this.TABS_MAP[tabId].label }
							</TabButton>
						)
					}
					<div className='Main__indicator' ref={ ref => this.indicator = ref } />
				</div>
				{ this.TABS_MAP[currentTabId].render.call(this) }
			</div>
		);
	}
}

export default Home;
