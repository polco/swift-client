import * as React from 'react';

import Button, { IButtonClass } from 'shared/components/Button';

import './Tabs.less';

export type LabelProps = { onUpdate: () => void };

type TabButtonProps = { tabId: string };
const TabButton = Button as IButtonClass<TabButtonProps>;

const INDI_WIDTH = 100;

export type Props = {
	tabs: Array<Array<{ tabId: string, Label: React.StatelessComponent<LabelProps> }>>,
	categoryIndex: number,
	currentTabId: string,
	onTabSelect(tabId: string | string): void,
	hideIndicator?: boolean
};

class Tabs extends React.PureComponent<Props> {
	private indicator: HTMLDivElement | null = null;
	private tabsRef: { [tabId: string]: Button<TabButtonProps> | null } = {};
	private tabWidth: { [tabId: string]: number } = {};
	private labelUpdated = true;

	public static defaultProps: Partial<Props> = { hideIndicator: false };

	public componentDidMount() {
		this.positionIndicator();
	}

	public componentDidUpdate() {
		this.positionIndicator();
	}

	private positionIndicator = () => {
		if (this.labelUpdated) {
			this.labelUpdated = false;
			for (const tabId in this.tabsRef) {
				const button = this.tabsRef[tabId];
				if (button) {
					this.tabWidth[tabId] = button.div!.clientWidth;
				}
			}
		}

		const { currentTabId, tabs, categoryIndex } = this.props;
		let fullWidth = 0;
		let passedCurrentTab = false;
		let beforeWidth = 0;
		for (const { tabId } of tabs[categoryIndex]) {
			if (tabId === currentTabId) { passedCurrentTab = true; }
			const width = this.tabWidth[tabId];
			if (!passedCurrentTab) {
				beforeWidth += width;
			}
			fullWidth += width;
		}
		beforeWidth -= fullWidth / 2;

		this.indicator!.style.transform =
			`translate3d(${beforeWidth + INDI_WIDTH / 2}px, 0, 0) scaleX(${ this.tabWidth[currentTabId] / INDI_WIDTH })`;
	}

	private selectTab = (button: Button<TabButtonProps>) => {
		this.props.onTabSelect(button.props.tabId);
	}

	private onLabelUpdate = () => {
		this.labelUpdated = true;
	}

	public render() {
		const { currentTabId, tabs, categoryIndex, hideIndicator } = this.props;

		return (
			<div className='Tabs'>
				<div className='Tabs__container' style={ { transform: `translate3d(0, ${ categoryIndex * -100 }%,0)` } }>
					{
						tabs.map((category, i) =>
							<div className='Tabs__category' key={ i }>
								<div className='Tabs__category_container' key={ i }>
								{
									category.map(({ tabId, Label }) =>
										<TabButton
											key={ tabId }
											className={ 'Tabs__tab' + (currentTabId === tabId ? ' Tabs__tab_active' : '') }
											onTap={ this.selectTab }
											tabId={ tabId }
											ref={ ref => this.tabsRef[tabId] = ref }
										>
											<Label onUpdate={ this.onLabelUpdate } />
										</TabButton>
									)
								}
								</div>
							</div>
						)
					}
				</div>
				<div
					className={ 'Tabs__indicator' + (hideIndicator ? ' Tabs__indicator_hidden' : '') }
					ref={ ref => this.indicator = ref }
				/>
			</div>
		);
	}
}

export default Tabs;
