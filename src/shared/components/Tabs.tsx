import * as React from 'react';

import Button, { IButtonClass } from 'shared/components/Button';

import './Tabs.less';

type TabButtonProps = { tabId: string };
const TabButton = Button as IButtonClass<TabButtonProps>;

export type Props = {
	tabs: Array<{ tabId: string, Label: React.StatelessComponent }>,
	currentTabId: string,
	onTabSelect(tabId: string): void
};

class Tabs extends React.PureComponent<Props> {
	private indicator: HTMLDivElement | null = null;
	private tabWidth: { [tabId: string]: number } = {};

	public componentDidMount() {
		this.positionIndicator();
	}

	public componentDidUpdate() {
		this.positionIndicator();
	}

	private positionIndicator = () => {
		const { currentTabId, tabs } = this.props;
		let fullWidth = 0;
		let passedCurrentTab = false;
		let beforeWidth = 0;
		for (const { tabId } of tabs) {
			if (tabId === currentTabId) { passedCurrentTab = true; }
			const width = this.tabWidth[tabId];
			if (!passedCurrentTab) {
				beforeWidth += width;
			}
			fullWidth += width;
		}

		this.indicator!.style.transform =
			`translate3d(${beforeWidth * 100 / fullWidth}%, 0, 0) scaleX(${ this.tabWidth[currentTabId] / fullWidth })`;
	}

	private saveTabRef = (button: Button<TabButtonProps> | null) => {
		if (button) {
			this.tabWidth[button.props.tabId] = button.div!.clientWidth;
		}
	}

	private selectTab = (button: Button<TabButtonProps>) => {
		this.props.onTabSelect(button.props.tabId);
	}

	public render() {
		const { currentTabId, tabs } = this.props;

		return (
			<div className='Tabs'>
				<div className='Tabs__container'>
					{
						tabs.map(({ tabId, Label }) => {

							return (<TabButton
								key={ tabId }
								className={ 'Tabs__tab' + (currentTabId === tabId ? ' Tabs__tab_active' : '') }
								onTap={ this.selectTab }
								tabId={ tabId }
								ref={ this.saveTabRef }
							>
								<Label />
							</TabButton>); }
						)
					}
					<div className='Tabs__indicator' ref={ ref => this.indicator = ref } />
				</div>
			</div>
		);
	}
}

export default Tabs;
